({
	processDragOver : function(component,event)
	{
		var insertIndex ; 
		var mouseReleaseCods = { "X" : event.pageX  , "Y" : event.pageY } ;
		var _self = this ;
		var allCompArray = component.find("dataCmp") ;		
		var configArray = [] ;
		var minDistance ;
 		if(allCompArray && allCompArray.length  && allCompArray.length > 1 )
		{
			//Multiple comps are available on page 
			allCompArray.forEach(function(eachElement)
			{
				var centerCods = _self.getCenterCoOrdinates(eachElement , mouseReleaseCods ) ;
				var distance = _self.getDistanceBetweenPoints(mouseReleaseCods , centerCods ) ;
				centerCods["Distance"] = distance ;

				configArray.push(centerCods) ;

				if(typeof minDistance == "undefined")
				{
					minDistance = distance ;
				}else
				{
					minDistance = Math.min(minDistance,distance) ;
				}
			});
		}else if(allCompArray && typeof allCompArray.length == "undefined")
		{
			//ONLY ONE COMP IS AVAILABLE 
			var centerCods = _self.getCenterCoOrdinates(allCompArray , mouseReleaseCods ) ;
			var distance = _self.getDistanceBetweenPoints(mouseReleaseCods , centerCods ) ;
			centerCods["Distance"] = distance ;
			configArray.push(centerCods) ;
			minDistance= distance ;
		}else
		{
			insertIndex = 0 ;
		}

		configArray.forEach(function(conf , index)
		{
			if(minDistance == conf.Distance  && typeof insertIndex == "undefined")
			{
				insertIndex = conf.Quad == "LEFT" ? index : (index + 1 ) ;
			}
		});

		var totalRecordsInContainer = component.get("v.recordList").length ;


		if(insertIndex == 0 && totalRecordsInContainer > 1 )
		{
			this.manageHighlightsForFirstLeftMultiple(component) ;
		}else if(insertIndex == 1 && totalRecordsInContainer == 1 )
		{
			this.manageHighlightsForFirstRight(component) ;
		}
		else if(insertIndex == 0 && totalRecordsInContainer == 1 )
		{
			//Hilight left side of First Element 
			//console.log("I will be first element on LEFT SIDE ") ;
			this.manageHighlightsForFirstLeft(component) ;
		}else if(insertIndex > 0 && totalRecordsInContainer > 0 )
		{
			var leftIndex = insertIndex*1 ; 
			var righIndex = insertIndex*1 - 1  ;
			this.manageHighlightsForCenter(component,leftIndex , righIndex) ;
		}
	},

	manageHighlightsForCenter : function(component,leftHighLightIndex , rightHighlightIndex)
	{
		var allCompArray = component.find("dataCmp") ;		
		if(allCompArray && allCompArray.length  && allCompArray.length > 1 )
		{
			//First Reset for all COMPONENT
			allCompArray.forEach(function(cmp)
			{
				cmp.resetIt();
			});

			//WE HAVE MORE THAN 1 COMPONENT AVAILABLE 
			allCompArray.forEach(function(cmp)
			{
				if(cmp.get("v.order") == leftHighLightIndex )
				{
					cmp.highLightLeft();
				}

				if(cmp.get("v.order") == rightHighlightIndex )
				{
					cmp.highLightRight();
				}	
			});
		}
	},


	manageHighlightsForFirstLeftMultiple : function(component)
	{
		var allCompArray = component.find("dataCmp") ;		
		if(allCompArray && allCompArray.length  && allCompArray.length > 1 )
		{
			//First Reset for all COMPONENT
			allCompArray.forEach(function(cmp)
			{
				cmp.resetIt();
			});

			//WE HAVE MORE THAN 1 COMPONENT AVAILABLE 
			allCompArray.forEach(function(cmp)
			{
				if(cmp.get("v.order") == 0 )
				{
					cmp.highLightLeft();
				}	
			});
		}
	},

	manageHighlightsForFirstLeft : function(component)
	{
		var allCompArray = component.find("dataCmp") ;		
		allCompArray.resetIt();
		allCompArray.highLightLeft();
	},

	manageHighlightsForFirstRight : function(component)
	{
		var allCompArray = component.find("dataCmp") ;		
		allCompArray.resetIt();
		allCompArray.highLightRight();
	},

	hanldeInit : function(component,event)
	{
		var _self = this ;
    	var recordList = component.get("v.recordList") ;
    	if(recordList && recordList.length > 0 )
    	{
    		recordList.forEach(function(rec , index )
    		{
    			_self.createEachNode(component,_self , rec , index );
    		});
    	}
	},

	processDropEvent : function(component , event ) 
	{
		event.preventDefault() ;
		var draggedElementParent = event.dataTransfer.getData("parent"); 
		var droppedElementData = JSON.parse(event.dataTransfer.getData("data") ); // Assuming simple string data 
		var insertIndex = this.getDroppedElementPosition(component,event) ;

		
		if(component.getLocalId() != draggedElementParent)  
		{
			// Dropped element is not from same container 
			// We need to add element to TARGET container at appropriate position 
			var recordList = component.get("v.recordList") ;
			recordList.splice(insertIndex , 0 , droppedElementData);
			this.rebuilChildComps(component,recordList);
			this.fireCompEvent(component,
				"ElementAccepted" ,
			{
				"acceptor" : component.getLocalId() ,
				"originalContainer" : draggedElementParent ,
				"data" : droppedElementData, 
				"originalOrder" : event.dataTransfer.getData("order")
			} ) ;
		}else if(component.getLocalId() == draggedElementParent)
		{
			var recordList = component.get("v.recordList") ;
			var originalPosition = event.dataTransfer.getData("order") ;
			var newPosition = insertIndex ;
			if(originalPosition == newPosition || (newPosition-originalPosition == 1 ))
			{
				
			}else
			{
				//Get Element added to list first 
				recordList.splice(insertIndex , 0 , droppedElementData);
				if(originalPosition > newPosition )
				{
					//Now element is moved in backward direction ,
					//So autometically index got increased , so Delete element from N+1
					var delIndx = originalPosition*1 + 1 ;
					recordList.splice(delIndx,1) ;
				}else if(originalPosition < newPosition)
				{
					// JUST REMOVE ELEMENT FROM original Index 
					recordList.splice(originalPosition,1) ;
				}
				component.set("v.recordList" , recordList ) ;
				this.rebuilChildComps(component , recordList) ;
			}	
		}
	} , 

	getDroppedElementPosition : function(component ,event )
	{
		var draggedElementParent = event.dataTransfer.getData("parent"); 
		var droppedElementData = JSON.parse(event.dataTransfer.getData("data") ); // Assuming simple string data 

		var insertIndex ; 
		var mouseReleaseCods = { "X" : event.pageX  , "Y" : event.pageY } ;
		var _self = this ;
		var allCompArray = component.find("dataCmp") ;		
		var configArray = [] ;
		var minDistance ;
 		if(allCompArray && allCompArray.length  && allCompArray.length > 1 )
		{
			//Multiple comps are available on page 
			allCompArray.forEach(function(eachElement)
			{
				var centerCods = _self.getCenterCoOrdinates(eachElement , mouseReleaseCods ) ;
				var distance = _self.getDistanceBetweenPoints(mouseReleaseCods , centerCods ) ;
				centerCods["Distance"] = distance ;

				configArray.push(centerCods) ;

				if(typeof minDistance == "undefined")
				{
					minDistance = distance ;
				}else
				{
					minDistance = Math.min(minDistance,distance) ;
				}
			});
		}else if(allCompArray && typeof allCompArray.length == "undefined")
		{
			//ONLY ONE COMP IS AVAILABLE 
			var centerCods = _self.getCenterCoOrdinates(allCompArray , mouseReleaseCods ) ;
			var distance = _self.getDistanceBetweenPoints(mouseReleaseCods , centerCods ) ;
			centerCods["Distance"] = distance ;
			configArray.push(centerCods) ;
			minDistance= distance ;
		}else
		{
			insertIndex = 0 ;
		}

		configArray.forEach(function(conf , index)
		{
			if(minDistance == conf.Distance  && typeof insertIndex == "undefined")
			{
				insertIndex = conf.Quad == "LEFT" ? index : (index + 1 ) ;
			}
		});

		return insertIndex ;
	},


	getCenterCoOrdinates : function(comp , mouseReleaseCods )
	{
		var element = comp.getElement() ;
		var elementCenterX_loc = Math.round(element.offsetLeft + (element.offsetWidth/2)) ;
        var elementCenterY_loc = Math.round(element.offsetTop + (element.offsetHeight/2)) ;	
        var min_X = element.offsetLeft ;
        var max_X = Math.round(element.offsetLeft + element.offsetWidth) ;
        var relativeClickPosition = mouseReleaseCods.X <= elementCenterX_loc ? 'LEFT' : 'RIGHT' ;
        var retRes = 
        	{
        		"X" : elementCenterX_loc , 
        		"Y" : elementCenterY_loc , 
        		"Min_X_Boundary" : min_X,
        		"Max_X_Boundary" : max_X , 
        		"data" : comp.get("v.data") ,
        		"order" : comp.get("v.order") ,
        		"Quad" : relativeClickPosition 
        	}  ;
        return retRes ;
	} , 

	getDistanceBetweenPoints : function(pointOne  , pointTwo )
	{
		var linearDist = 0 ;
		if(pointOne && pointTwo && pointTwo.X && pointTwo.Y && pointOne.X && pointOne.Y)
		{
			var a = pointTwo.X - pointOne.X;
        	var b = pointTwo.Y - pointOne.Y ;
	        linearDist = Math.round(Math.sqrt( a*a + b*b ));
		}else
		{
			console.error("INVALID OPERATION") ;
		}

		return linearDist ;
	},

	createEachNode : function(component , _self , rec , index )
	{
		_self.createDynamicComponent
			(
				"c:Draggable",
				{
					"data" : rec ,
					"aura:id" : "dataCmp" ,
					"parentContainerName" : component.get("v.uniqueName") ,
					"order" : index 
				},
				component
			);
	},

	rebuilChildComps : function(component,recordList)
	{
		var _self = this ;	
		//First Destroy all existing comps 
		var comps = component.find("dataCmp") ;
		if(comps && typeof comps.length == "undefined" )
		{
			comps.destroy() ;
		}else if(comps && comps.length && comps.length > 1 )
		{
			comps.forEach(function(c)
			{
				c.destroy() ;
			});
		}else
		{
			// WHAT ?? 
		}

		recordList.forEach(function(el , index )
		{
			_self.createEachNode(component,_self,el , index );
		});

		console.log("Updated Data Set for ----> " ,  component.getLocalId() ,"======>",recordList ) ;
		console.error("Fire Event With Updated data set ") ;
	},


    adjustRecordSets : function(component,event)
    {
        var params = event.getParam("arguments") ;
        var originalList = component.get("v.recordList") ;
        originalList.splice(params.originalOrder,1) ;
        component.set("v.recordList" , originalList) ;
        this.rebuilChildComps(component,originalList) ;
    },

    hanldeDragEnds : function(component,event)
    {
    	this.resetStyling(component) ;
    },


	handleDragOver : function(component,event)
	{
	    var d = this.addTimeDelay(component,"v.delta" , 200 ) ;
	    if(d > 0 )
	    {
	        this.processDragOver(component,event) ;
	    }
	},

	processDragLeave : function(component,event)
	{
       var d = this.addTimeDelay(component,"v.deltaLeave" , 50 ) ;
       
       if(d > 0 )
       {
       	 this.resetStyling(component);            
       } 
	},

	resetStyling : function (component)
	{
		var allCompArray = component.find("dataCmp") ;		
		if(allCompArray && allCompArray.length  && allCompArray.length > 1 )
		{
			//First Reset for all COMPONENT
			allCompArray.forEach(function(cmp)
			{
				cmp.resetIt();
			});
		}

		if(allCompArray && typeof allCompArray.length == "undefined" )
		{
			allCompArray.resetIt() ;
		}
	},

	addTimeDelay : function(component , property , devident)
	{
		var variance = 0 ;

		var timeStamp =  Math.floor(Date.now()/devident) ;

	    if(component.get(property) == 0 )
	    {
	        component.set(property , timeStamp) ; 
	    }else
	    {
	       variance = timeStamp  - component.get(property) ;
	       component.set(property , timeStamp ) ;
	    }

		return variance ;
	} 
})