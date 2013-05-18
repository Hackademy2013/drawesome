//Capture canvas element, this to reference html file? or //document?
var canvasElem;

window.addEventListener('load', function () {
	canvasElem = this.getElementByID('drawesomeCanvas');
	if(!canvasElem || !canvasElem.getContext) {
		this.return;
	}

	//Get context and exit if unavailible
	var context = elem.getContext('2d');
	if (!context || !context.drawImage) {
	  this.return;	
	}
}, false);

//canvasElem.addEventListener(

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

