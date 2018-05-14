({
	dragStart : function(component, event, helper) 
	{
		helper.addDataToEvent(component,event) ;
	},

	dragEnd : function(component,event, helper)
	{
		helper.hanldeDragEnds(component,event) ;
	},

	resetIt : function(component,event,helper)
	{
		helper.resetState(component,event) ;
	},

	highLightLeft : function(component,event,helper)
	{
		helper.highLightLeft(component);
	},

	highLightRight : function(component,event,helper)
	{
		helper.highLightRight(component);
	}
})