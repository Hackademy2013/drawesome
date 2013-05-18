//Capture canvas element, this to reference html file? or //document?
var canvasElem;
var traceable = false;
var traceQueue = new Array();
jQuery(document).ready(function(){
  canvasElem = $('#drawesomeCanvas');
  
  //Check if referenceing the canvas
  if(canvasElem.length > 0) {
    //alert('woohoo');
  }
  else {
    alert('boo');
  }
  
  $(canvasElem).on({
	  mouseenter: function(){ //begin to be traceable
	    traceable = true
	  },
	  mouseleave: function() { //no longer traceable 
	    traceable = false;
	  },
	  mousedown: function(e){ //call recordMouseCoord
	    recordMouseCoord(e, canvasElem);
	  }
  });
  
  
  //Old Code, constant event alerts to movement
  /*$(canvasElem).mousedown(function(e) {
    $(canvasElem).mousemove(function (e) {
	  tracking = true;
	  recordMouseCoord(e);	
	});
  });
  $(canvasElem).mouseup(function(e) {
	  tracking = false;*/
});
    
function recordMouseCoord(mouse, cElement)
{
  traceQueue.push({x: mouse.pageX, y: mouse.pageY});
  for(var i=0; i<traceQueue.length; ++i) {
    alert("Mouse Coord: [" +(traceQueue[i].x) + 
    ", " + (traceQueue[i].y) + "]");
	}
  
  
  //alert("Mouse Coord: [" +(mouse.pageX) + 
  //  ", " + (mouse.pageY) + "]");
	
}

//function onMouseDown
// Event: Purpose is to call recordMouseCoord

//function onMouseUp
// Event: Purpose is to call 

//function recordMouseCoord/startMouseTrail
// Store coords in a queue, FIFO. Started by onMouseDown.

//function endMouseTrail 
//Stop recording, called by onMouseUp

//function submitMouseTrail
// send mouseTrail queue to server, 
// pull X from top and wait Xsecs before sending again