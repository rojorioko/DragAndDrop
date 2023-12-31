import { mergeStyles } from "@fluentui/react/lib/Styling";
import { IInputs } from "../generated/ManifestTypes";
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
    
    export class Helper {
        public static ShowAlertMessage(context: ComponentFramework.Context<IInputs>, message: string): void {
            context.navigation.openAlertDialog({ text: message });
        }
        //Use this for local testing. Replace CRM Create call with this function.
        public static TestApi (): Promise<ComponentFramework.LookupValue> { 
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let samplData: ComponentFramework.LookupValue = {
                        id: '1',
                        entityType: 'dummy'
                    }
                    resolve(samplData);
                }, 1000);
            })
        }
    }

    export class UserInterface
    {
        public static GetIconDesign(): string
        {
            const iconClass = mergeStyles({
                fontSize: 50,
                height: 50,
                width: 50,
                margin: '0 25px',
                color: '#242424'
              });

              return iconClass
        }
    }
}