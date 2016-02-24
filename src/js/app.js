var Draggable = require('./vendors/Draggable.js');

// https://github.com/samthor/rippleJS, not a commonJS module
require('./vendors/ripple.js');

function isMobile(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    
  }

  else {
    var droppableArr = [];
    // initialize draggable(s)
    $( '.draggable' ).map( function(i) {
      new Draggable( this, droppableArr, {
        draggabilly : { containment: document.body }
      } );
    } );
  }
}

window.addEventListener('load', function(){
  isMobile()
})
