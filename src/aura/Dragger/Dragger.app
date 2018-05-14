<aura:application extends="force:slds" access="GLOBAL">
	<aura:attribute type="List" name="letterList" default="['Apple','Google','Salesforce.com' , 'Amazon' , 'Microsoft']"/>
	<aura:attribute type="List" name="letterListTwo" default="['Cat' , 'Dog' , 'Mango' ,'Berry'  , 'Mouse' ,'Tiger' , 'Bingoo' ]"/>
	<aura:attribute type="List" name="letterListThree" default="[]"/>
	
	<aura:dependency type="COMPONENT" resource="c:Draggable"/>
	<aura:handler name="ElementAccepted" event="c:DraggedElementAcceptedEvt" action="{!c.hanldeElementAccepted}"/>
	
	<c:DraggableContainer aura:id="containerOne" recordList="{!v.letterList}" uniqueName="containerOne"/>
	<c:DraggableContainer aura:id="containerTwo" recordList="{!v.letterListTwo}" uniqueName="containerTwo"/>
	<c:DraggableContainer aura:id="containerThree" recordList="{!v.letterListThree}" uniqueName="containerThree"/>
	
</aura:application>