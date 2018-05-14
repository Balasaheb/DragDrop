({
	/*
        Generic method to create Lightning component dynamically
    */
    createDynamicComponent : function(componentName , atrributeMap , component) 
	{
		$A.createComponent
		(
			componentName,
			atrributeMap ,
			function(dynamicComponentName, status, errorMessage)
			{
				//Add the new button to the body array
                if (status === "SUCCESS") 
                {
                    var body = component.get("v.body");
                    body.push(dynamicComponentName);
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") 
                {
                    console.log("No response from server or client is offline.")
                    // Show offline error
                }
                else if (status === "ERROR") 
                {
                    console.log("Error: " + errorMessage);
                    // Show error message
                }
			}
		);	
	}
})