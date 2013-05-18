//Capture canvas element, this to reference html file? or //document?
var canvasElem;
var traceable = false;
var drawing = false;
var traceQueue = new Array();
var NEGLIGIBLE_MOVEMENT = 7;

jQuery(document).ready(function(){
  canvasElem = $('#drawesomeCanvas');
  
  //Check if referenceing the canvas
  if(canvasElem.length > 0) {
    //alert('woohoo');
  }
  else {
    alert('boo');
  }
  $(document).mouseup()
  $(canvasElem).on({
	  mouseenter: function(){ //begin to be traceable
	    traceable = true
		console.log("traceable!");
	  },
	  mouseleave: function() { //no longer traceable or drawing
	    traceable = false;
		drawing = false;
		console.log("UNtraceable!");
	  },
	  mousedown: function() { //switch mouseDrawing off
	    drawing = true;
		console.log("Drawing!");
	  },
	  mouseup: function() {//switch mouseDrawing off
	    drawing = false;
		console.log("NotDrawing!");
	  },
	  mousemove: function(e){ //call recordMouseCoord
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
  if(traceable && drawing)
  {
    //Looking for upper then lower bounds of X then Y of what to record
	//This is to keep the queue with only pertinent coordinates and not every small movement of the mouse. 
	//negligableMovement is defined as const at top
	if(traceQueue.length == 0) {
	  traceQueue.push({X: mouse.pageX, Y: mouse.pageY});
	}
    else if(mouse.pageX >= (traceQueue[traceQueue.length-1].X + NEGLIGIBLE_MOVEMENT) ) { 
      traceQueue.push({X: mouse.pageX, Y: mouse.pageY});
	}
	else if(mouse.pageX <= (traceQueue[traceQueue.length-1].X - NEGLIGIBLE_MOVEMENT) ) {
	  traceQueue.push({X: mouse.pageX, Y: mouse.pageY});
	}
	else if(mouse.pageY >= (traceQueue[traceQueue.length-1].Y + NEGLIGIBLE_MOVEMENT) ) { 
      traceQueue.push({X: mouse.pageX, Y: mouse.pageY});
	}
	else if(mouse.pageY <= (traceQueue[traceQueue.length-1].Y - NEGLIGIBLE_MOVEMENT) ) {
	  traceQueue.push({X: mouse.pageX, Y: mouse.pageY});
	}
	
    console.log(traceQueue[traceQueue.length-1]);
	console.log(mouse.pageX + " " + mouse.pageY);
	console.log("X: Min: " +(traceQueue[traceQueue.length-1].X - NEGLIGIBLE_MOVEMENT) + " Max: " + (traceQueue[traceQueue.length-1].X + NEGLIGIBLE_MOVEMENT));
	console.log("Y: Min: " +(traceQueue[traceQueue.length-1].Y - NEGLIGIBLE_MOVEMENT) + " Max: " + (traceQueue[traceQueue.length-1].Y + NEGLIGIBLE_MOVEMENT));
	//console.log((traceQueue[traceQueue.length-1].Y));
	console.log(traceQueue.length);
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