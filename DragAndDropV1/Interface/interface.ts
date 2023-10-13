export interface IDragAndDropProps
{
    webApi: ComponentFramework.WebApi,
    utility: ComponentFramework.Utility,
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

export interface ICrmAttachment
{
    documentbody: string,
    filename: string,
    notetext: string,
    subject: string,
    mimetype: string
}