var Draggable = require('./vendors/Draggable.js');

// https://github.com/samthor/rippleJS, not a commonJS module
require('./vendors/ripple.js');

function assignEasterEggs(){
  var links = {
    'ee_balance-bear.gif': 'balanceBear',
    'ee_client.gif': 'clientReaction',
    'ee_gianluca.png': 'gianlucaMeme',
    'ee_pizza.gif': 'pizzaGradient',
    'ee_psycho-cat.gif ': 'psychoCat',
    'ee_pushforce.png': 'pushForce',
    'ee_too-quick-devops.gif': 'tooQuickDevops',
    'ee_ux-glass.gif': 'uxGlass',
    'ee_vvo.jpg': 'vvoThumb',
    'ee_jimcarrey.gif': 'jimCarrey'
  };
  for (var key in links) {
    if (links.hasOwnProperty(key)) {
      document.getElementById(links[key]).src = 'img/'+key
    }
  }
}



function isMobile(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return;
  }

  var droppableArr = [];
  // initialize draggable(s)
  $( '.draggable' ).map( function(i) {
    new Draggable( this, droppableArr, {
      draggabilly : { containment: document.body }
    } );
  } );

  assignEasterEggs()

}

window.addEventListener('load', function(){
  isMobile()
})
