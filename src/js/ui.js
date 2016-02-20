//var Draggabilly = require('draggabilly');
var classie = require('classie');
var Modernizr = require('./vendors/modernizr.js');
var Draggable = require('./vendors/dragDrop.js');

// if you have multiple .draggable elements
// get all draggie elements

	var body = document.body,

	droppableArr = [];

	// initialize draggable(s)
	$( '.draggable' ).map( function(i) {
		new Draggable( this, droppableArr, {
			draggabilly : { containment: document.body },
			onStart : function() {
				classie.add( body, 'drag-active' );
			},
			onEnd : function( wasDropped ) {
				classie.remove( body, 'drag-active' );
			}
		} );
	} );
