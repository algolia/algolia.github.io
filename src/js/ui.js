var Modernizr = require('./vendors/modernizr.js');
var Draggable = require('./vendors/dragDrop.js');
var ripple = require('./vendors/ripple.min.js')

// if you have multiple .draggable elements
// get all draggie elements

	var body = document.body,

	droppableArr = [];

	// initialize draggable(s)
	$( '.draggable' ).map( function(i) {
		new Draggable( this, droppableArr, {
			draggabilly : { containment: document.body },
			onStart : function() {

			},
			onEnd : function( wasDropped ) {
				
			}
		} );
	} );
