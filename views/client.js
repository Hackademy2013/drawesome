//Capture canvas element, this to reference html file? or //document?
var canvasElem;
var canvasContext;
var traceable = false;
var drawing = false;
var traceQueue = new Array();
var NEGLIGIBLE_MOVEMENT = 15;
var SUBMIT_DELAY = 2;

jQuery(document).ready(function(){
  //canvasElem = $('#drawesomeCanvas');
  canvasElem = document.getElementById("drawesomeCanvas");
  canvasContext = canvasElem.getContext("2d");
  
  //Check if referenceing the canvas
  if(canvasElem.length > 0) {
    alert('woohoo');
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
	
	if(traceQueue.length >= 2)
	{
	  canvasContext.moveTo(traceQueue[0].X, traceQueue[0].Y);
	  console.log("Moving to: " + traceQueue[0].X + ", " + traceQueue[0].Y);
	  canvasContext.lineTo(traceQueue[1].X, traceQueue[1].Y);
	  console.log("Lining to: " + traceQueue[1].X + ", " + traceQueue[1].Y);
	  canvasContext.stroke();
	  var lastLocalRemoved = traceQueue.shift();
	}
    //console.log(traceQueue[traceQueue.length-1]);
	//console.log(mouse.pageX + " " + mouse.pageY);
	//console.log("X: Min: " +(traceQueue[traceQueue.length-1].X - NEGLIGIBLE_MOVEMENT) + " Max: " + (traceQueue[traceQueue.length-1].X + NEGLIGIBLE_MOVEMENT));
	//console.log("Y: Min: " +(traceQueue[traceQueue.length-1].Y - NEGLIGIBLE_MOVEMENT) + " Max: " + (traceQueue[traceQueue.length-1].Y + NEGLIGIBLE_MOVEMENT));
	//console.log(traceQueue.length);
  }
	
}

//function receiveTraceFromServer(ID, traceQueue)
//each ID has it's own traceQueue
//drawTraceFromServer

//function drawTraceFromServer
//foreach draw lines from first point to each sequential point
//shift used points


//function submitTraceToServer //triggered by time.Events every SUBMIT_DELAY seconds
// send mouseTrail queue to server, 
// pull X from top and wait Xsecs before sending again