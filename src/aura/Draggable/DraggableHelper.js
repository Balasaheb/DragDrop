({
	addDataToEvent : function(component , event )
	{
		event.dataTransfer.setData("parent" , component.get("v.parentContainerName")) ;
		event.dataTransfer.setData("data" , JSON.stringify(component.get("v.data"))) ;
		event.dataTransfer.setData("order" , component.get("v.order")) ;
	},

	resetState : function(component,event)
	{
		var container = component.find("elementContainer") ;
		if($A.util.hasClass(container, "LeftSide"))
		{
			$A.util.removeClass(container, "LeftSide") ;	
		}

		if($A.util.hasClass(container, "RightSide"))
		{
			$A.util.removeClass(container, "RightSide") ;	
		}
	},

	dragEnd : function(component,event)
	{
		var container = component.find("elementContainer") ;
		if($A.util.hasClass(container, "LeftSide"))
		{
			$A.util.removeClass(container, "LeftSide") ;	
		}

		if($A.util.hasClass(container, "RightSide"))
		{
			$A.util.removeClass(container, "RightSide") ;	
		}
	},

	highLightLeft : function(component)
	{
		var container = component.find("elementContainer") ;
		if($A.util.hasClass(container, "LeftSide") == false )
		{
			$A.util.addClass(container, "LeftSide") ;	
		}		
	},

	highLightRight : function(component)
	{
		var container = component.find("elementContainer") ;
		if($A.util.hasClass(container, "RightSide") == false )
		{
			$A.util.addClass(container, "RightSide") ;	
		}		
	},

	hanldeDragEnds : function(component,event)
	{
		this.fireCompEvent(component , "DragEnds" , {} );
	}
})