import { IInputs } from "../generated/ManifestTypes"

export interface IDragAndDropProps
{    
    context: ComponentFramework.Context<IInputs>,
    referenceRecord: ComponentFramework.LookupValue,
    isNoteAttachment: boolean
}

export interface IFile
{
 name: string,
 type: string,
 size: number,
 path: string,
 lastModifiedDate: Date
}

export interface ICrmFile
{
 file: IFile,
 content: string
}

export interface ICrmAttachment
{
    documentbody: string,
    filename: string,
    notetext: string,
    subject: string,
    mimetype: string
}