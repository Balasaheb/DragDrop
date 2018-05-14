({
	dropHandler : function(component , event , helper)
    {
       helper.processDropEvent(component,event) ;
    },
    
    dragOverHandler : function(component , event , helper)
    {
      event.preventDefault() ;
      helper.handleDragOver(component,event) ;
    }
    
    ,
    dragLeaveHandler : function(component , event , helper)
    {
       event.preventDefault() ;
       helper.processDragLeave(component,event) ;
    },

    adjustRecordSet : function(component,event , helper)
    {
    	helper.adjustRecordSets(component,event) ;
    },

    init : function(component,event,helper)
    {
    	helper.hanldeInit(component,event) ;
    },

    hanldeDragEnds : function(component,event,helper)
    {
        helper.hanldeDragEnds(component,event) ;
    }
})