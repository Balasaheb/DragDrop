({
	/*
        Generic component provides methods to fire component events 
    */
    fireCompEvent : function(component,eventName , params )
    {
        var compEve = component.getEvent(eventName) ;
        if(compEve)
        {
            compEve.setParams(params);
            compEve.fire();
        }else
        {
            console.error('No EVENT FOUD ') ;
        }
    }
})