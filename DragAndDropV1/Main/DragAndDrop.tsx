import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { IFile, IDragAndDropProps } from '../Interface/interface';
import { Utility } from '../Helper/Utility';
import { Constant } from '../Helper/Constant';

const FileUpload = (props: IDragAndDropProps) =>  {  
  const getbase64DataOnly = (base64File: string): string =>{    
    const base64Text = ';base64,';          
    const base64Index = base64File.indexOf(base64Text) + base64Text.length;
    const dataOnly = base64File.substring(base64Index);

    return dataOnly
  }
  const onAfterDrop =(acceptedFiles: any) => {  
    console.log(acceptedFiles);  
    setSelectedFiles(acceptedFiles);
  }  
  const entitySetName = useRef(`${props.referenceRecord.entityType}s`)
  const filesToUpload: IFile[] = [];
  const [selectedFiles, setSelectedFiles] = useState(filesToUpload);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onAfterDrop
  });
  
  useEffect(() => {
    setEntityMetaData()
  }, [])
  useEffect(() => {
    readAndUploadFiles()    
  }, [selectedFiles])

  const setEntityMetaData = () => {
    props.utility.getEntityMetadata(props.referenceRecord.entityType)
      .then(value => {        
        entitySetName.current = value['EntitySetName']
      });
  }
  const readAndUploadFiles = () => {
      selectedFiles.forEach((file: IFile) => {
        const fileReader = new FileReader();

        fileReader.onabort = () => console.log('file reading was aborted')
        fileReader.onerror = () => console.error(`Errorfile reading file ${file.name}`)
        fileReader.onload = () => {        
          const fileBase64Content = fileReader.result as string;
          const dataOnly = getbase64DataOnly(fileBase64Content);
          console.log(dataOnly);

          uploadSelectedFiles(file, dataOnly);
        }      

        fileReader.readAsDataURL(file as any);
      })
  }
  const uploadSelectedFiles = (file: IFile, fileContent: string) => {
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
       
    Utility.CrmActions.CreateRecord(props.webApi, fileToUpload, entityName);
  }

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here.</p>
        <ul>
          {selectedFiles.map((file: any) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
        
      </div>
      <button >Upload Files</button>
    </>
  );
};
export default FileUpload;