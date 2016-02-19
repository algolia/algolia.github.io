var Modernizr = require('./vendors/modernizr.js');
var Draggabilly = require('./vendors/draggabilly.min.js');
var Draggable = require('./vendors/dragDrop.js');

// if you have multiple .draggable elements
// get all draggie elements
var draggableElems = document.querySelectorAll('.draggable');
// array of Draggabillies
var draggies = []
// init Draggabillies
for ( var i=0, len = draggableElems.length; i < len; i++ ) {
  var draggableElem = draggableElems[i];
  var draggie = new Draggabilly( draggableElem, {
    // options...
  });
  draggies.push( draggie );
}

(function() {
  // initialize draggable(s)
  [].slice.call(document.querySelectorAll( '#grid .grid__item' )).forEach( function( el ) {
    new Draggable( el, false, {
      draggabilly : { containment: document.body },
      onStart : function() {
        // add class 'drag-active' to body
        classie.add( body, 'drag-active' );
        // clear timeout: dropAreaTimeout (toggle drop area)
        clearTimeout( dropAreaTimeout );
        // show dropArea
        classie.add( dropArea, 'show' );
      },
      onEnd : function( wasDropped ) {
        var afterDropFn = function() {
          // hide dropArea
          classie.remove( dropArea, 'show' );
          // remove class 'drag-active' from body
          classie.remove( body, 'drag-active' );
        };

        if( !wasDropped ) {
          afterDropFn();
        }
        else {
          // after some time hide drop area and remove class 'drag-active' from body
          clearTimeout( dropAreaTimeout );
          dropAreaTimeout = setTimeout( afterDropFn, 400 );
        }
      }
    } );
  } );
})();