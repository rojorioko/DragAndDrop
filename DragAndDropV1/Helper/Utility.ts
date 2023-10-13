import { IFile } from "../Interface/interface";

export namespace Utility{
    export class CrmActions 
    {
        public static async CreateRecord(xrmApi: ComponentFramework.WebApi, fileData: ComponentFramework.WebApi.Entity, entityName: string): Promise<ComponentFramework.LookupValue>
        {            
            try {
                let result: ComponentFramework.LookupValue = await xrmApi.createRecord(entityName, fileData);

                return Promise.resolve(result);
            }
            catch (error) {
                console.log(error);
                return Promise.reject(new Error((error as any).message));
            }
        } 
    }

    export class DataConverter
    {
        public static ConvertFileDataToCrm(fileData: IFile) {

        }
    }
}