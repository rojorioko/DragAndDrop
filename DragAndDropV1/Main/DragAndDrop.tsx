import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IFile, IDragAndDropProps, ICrmFile } from '../Interface/interface';
import { Utility } from '../Helper/Utility';
import { Constant } from '../Helper/Constant';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Label } from '@fluentui/react';

initializeIcons();

const FileUpload = (props: IDragAndDropProps) =>  {    
  //#region Hooks    
  const entitySetName = useRef(`${props.referenceRecord.entityType}s`)
  const [uploadInProgress, setuploadInProgress] = useState(false)
  const [showList, setshowList] = useState(false)
  const [uploadCount, setUploadCount] = useState(0);    
  const [selectedFiles, setSelectedFiles] = useState(new Array<IFile>());    
  const onAfterDrop = useCallback((acceptedFiles: any) => {  
    console.log(acceptedFiles);
    if (!uploadInProgress) { 
      setSelectedFiles(acceptedFiles);
      readAndUploadFiles(acceptedFiles);
    }
  }, [uploadCount, selectedFiles])  
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAfterDrop
  });
  
  useEffect(() => {
    setEntityMetaData()
  }, [])
  useEffect(() => {
    console.log(`Uploaded ${uploadCount} of ${selectedFiles.length}`);
  }, [uploadCount])  
  //#endregion

  //#region Local Functions
  const setEntityMetaData = () => {
    props.context.utils.getEntityMetadata(props.referenceRecord.entityType)
      .then(value => {        
        entitySetName.current = value['EntitySetName']
      });
  }
  const readAndUploadFiles = async (acceptedFiles: any) => {
    if (acceptedFiles.length > 0)    {
      setuploadInProgress(true)
    }

    for (let i = 0; i < acceptedFiles.length; i++) {
        setUploadCount(prevCount => prevCount + 1);
        const file = acceptedFiles[i] as IFile;        
        const dataOnly = (await readFileContent(file)) as string;              
        await uploadSelectedFilesToCrm(file, dataOnly);      
        //await testApi(file, dataOnly);      
        console.log(`Uploaded ${uploadCount}. Count ${selectedFiles.length}`)          
    }
    
    resetState();
    setuploadInProgress(false);    
  }
    const uploadSelectedFilesToCrm = async (file: IFile, fileContent: string) => {
      try{
          const fieldName = props.isNoteAttachment ? Constant.FieldDocumentBody : Constant.FieldBody;
          const entityName = props.isNoteAttachment ? Constant.Notes : Constant.ActivityAttachment;
          let fileToUpload: ComponentFramework.WebApi.Entity = { }; 
          
          fileToUpload[fieldName] = fileContent;
          fileToUpload[Constant.FieldFilename] = file.name;    
          fileToUpload[Constant.FieldObjectTypeCode] = props.referenceRecord.entityType;
          
          if(file.type){
            fileToUpload[Constant.FieldMimeType] = file.type;
          }

          if (props.isNoteAttachment) {
            fileToUpload[`objectid_${props.referenceRecord.entityType}@odata.bind`] = `/${entitySetName.current}(${props.referenceRecord.id})`;            
          }
          else {
            fileToUpload[Constant.FieldActivityPointers] = `/activitypointers(${props.referenceRecord.id})`;      
          }
            
          await Utility.CrmActions.CreateRecord(props.context.webAPI, fileToUpload, entityName);  
        } catch(error)  {
          Utility.Helper.ShowAlertMessage(props.context, (error as any).message);
        }
    }
    var resetState = () => {
      setSelectedFiles([]);
      setUploadCount(0);
    }
    var getbase64DataOnly = (base64File: string): string =>{    
      const base64Text = ';base64,';          
      const base64Index = base64File.indexOf(base64Text) + base64Text.length;
      const dataOnly = base64File.substring(base64Index);

      return dataOnly
    }
    var readFileContent = async (inputFile: IFile) => new Promise((resolveFunction, rejectFunction) => {
      const fileReader = new FileReader();        
          fileReader.onerror = (error) => {
            console.error(error)          
            rejectFunction(Constant.LabelErrorMessage)
          }
          fileReader.onload = async () => {                
            const fileBase64Content = fileReader.result as string;
            const dataOnly = getbase64DataOnly(fileBase64Content);
            resolveFunction(dataOnly);                              
          }      

          fileReader.readAsDataURL(inputFile as any);
    })
    const testApi = async (file: IFile, fileContent: string) => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('done');
        }, 1000);
    })
//#endregion

  return (
    <>                
        <div id='div-main-dragdrop' {...getRootProps()} className={isDragActive ? 'div-main-activedrag' : ''}>
        { uploadInProgress ? 
            (
            <Spinner label={Constant.LabelLoadingText + ` ${uploadCount} of ${selectedFiles.length}`} />
            ) 
            : 
            (
              <div>
                <FontIcon aria-label='BulkUpload' iconName='BulkUpload' className={Utility.UserInterface.GetIconDesign()}/>
                <input {...getInputProps()} />
                <Label className={Constant.CenterAlign}>{Constant.LabelDropFile}</Label>  
            </div>
            )
          }                                    
        </div>
        { !showList ? null :
          <ul>
            {selectedFiles.map((file: any) => (
              <li key={file.name}>{file.name}</li>
            ))}          
          </ul>        
          }               
    </>
  );
};
export default FileUpload;