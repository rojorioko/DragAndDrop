import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';

import {IInputs, IOutputs} from "./generated/ManifestTypes";
import FileUpload from "./Main/DragAndDrop";
import { IDragAndDropProps } from "./Interface/interface";

export class DragAndDropV1 implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _dragAndDropProps: IDragAndDropProps;
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        // Add control initialization code
        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._dragAndDropProps = {
            webApi: context.webAPI,
            utility: context.utils,
            isNoteAttachment: context.parameters.UploadAsNotes.raw === '1',
            referenceRecord:{
                id: (context as any).page.entityId,
                entityType: (context as any).page.entityTypeName
            }
        }
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view    
        // ReactDOM.render(
        //     React.createElement(UseEffectDemo),
        //     this._container
        //   ); 
            
          const root = createRoot(this._container);
          
          root.render(React.createElement(FileUpload, this._dragAndDropProps))
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
