var Modernizr = require('./vendors/modernizr.js');
var Draggable = require('./vendors/dragDrop.js');
var classie = require('desandro-classie');


(function() {
        var body = document.body,
          dropArea = document.getElementById( 'drop-area' ),
          droppableArr = [], dropAreaTimeout;

        // initialize droppables
        [].slice.call( document.querySelectorAll( '#drop-area .drop-area__item' )).forEach( function( el ) {
          droppableArr.push( new window.Droppable( el, {
            onDrop : function( instance, draggableEl ) {
              // show checkmark inside the droppabe element
              classie.add( instance.el, 'drop-feedback' );
              clearTimeout( instance.checkmarkTimeout );
              instance.checkmarkTimeout = setTimeout( function() { 
                classie.remove( instance.el, 'drop-feedback' );
              }, 800 );
              // ...
            }
          } ) );
        } );

        // initialize draggable(s)
        [].slice.call(document.querySelectorAll( '#grid .grid__item' )).forEach( function( el ) {
          new window.Draggable( el, droppableArr, {
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