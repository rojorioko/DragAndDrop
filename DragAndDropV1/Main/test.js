var formContext;
function onLoad(exeContext){
    formContext = exeContext.getFormContext();     
}

function upload(){
    if(formContext.data.entity.getIsDirty()){
        var activityId = formContext.data.entity.getId().replace(/[{}]/g, "");
        var activityType = formContext.data.entity.getEntityName();
        
        var record = {};
        record.documentbody = formContext.getAttribute('crc2e_data').getValue()
        record.filename = "sample.pdf"; // Text
        record["objectid_email@odata.bind"] = "/emails(" + activityId +")"; // Lookup
        record.notetext = "Test"; // Multiline Text
        record.subject = "Test"; // Text
        record.mimetype = "application/pdf";

        Xrm.WebApi.createRecord("annotation", record).then(
            function success(result) {
                var newId = result.id;
                console.log(newId);
            },
            function(error) {
                console.log(error.message);
            }
        );
    }
}
