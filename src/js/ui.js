var Modernizr = require('./vendors/modernizr.js');
var Draggable = require('./vendors/dragDrop.js');
var ripple = require('./vendors/ripple.min.js')

var droppableArr = [];
// initialize draggable(s)
$( '.draggable' ).map( function(i) {
	new Draggable( this, droppableArr, {
		draggabilly : { containment: document.body }
	} );
} );
