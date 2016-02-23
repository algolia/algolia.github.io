var Draggable = require('./vendors/Draggable.js');

// https://github.com/samthor/rippleJS, not a commonJS module
require('./vendors/ripple.js');

var droppableArr = [];
// initialize draggable(s)
$( '.draggable' ).map( function(i) {
  new Draggable( this, droppableArr, {
    draggabilly : { containment: document.body }
  } );
} );

function isMobile(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var wrappers = document.querySelectorAll('figure.project-wrapper');
    for(i=0;i<wrapper.length;i++) {
      wrappers[i].classList.remove('draggable')
    }
  }
}

window.addEventListener('load', function(){
  isMobile()
})
