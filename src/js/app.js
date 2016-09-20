require('./analytics.js');

var Draggable = require('./vendors/Draggable.js');

// https://github.com/samthor/rippleJS, not a commonJS module
require('./vendors/ripple.js');

function assignEasterEggs(){
  var cloudinary = 'https://res.cloudinary.com/hilnmyskv/image/upload/fl_lossy,';
  var links = {
    'w_277,h_150,f_auto,c_fill/ee_balance-bear_zqsw68.gif': 'balanceBear',
    'h_310,w_565,f_auto,c_fit/ee_client_wmg5na.gif': 'clientReaction',
    'w_277,h_150,f_auto,c_fill/ee_gianluca_wjxviy.png': 'gianlucaMeme',
    'f_auto,c_fill/ee_pizza_tpfwrg.gif': 'pizzaGradient',
    'w_277,h_150,f_auto,c_fill/ee_catshirt_jlxmqe.gif ': 'catShirt',
    'w_277,h_150,f_auto,c_fill/ee_nyan_tqq2lj.gif ': 'psychoCat',
    'w_277,h_150,f_auto,c_fill/ee_pushforce_ruydz3.gif': 'pushForce',
    'w_277,h_310,f_auto,c_fill/ee_too-quick-devops_cl8kov.gif': 'tooQuickDevops',
    'w_565,h_310,f_auto,c_fill/ee_ux-glass_bi6kb0.gif': 'uxGlass',
    'w_277,h_310,f_auto,c_fill/ee_vvo_gzsxfu.jpg': 'vvoThumb',
    'b_rgb:214062,e_displace/h_310,w_277,f_auto,c_fill/ee_pumpgirl_wsbhu8.gif': 'pumpIt',
    'f_auto,c_fill/ee_flyingsquirrels_hfuw6n.gif': 'flyingSquirrels',
    'w_277,h_150,f_auto,c_fill/ee_trainblocked_tg1wsv.gif': 'blockedTrain',
    'w_565,h_150,f_auto,c_fill/ee_dance_lpj2nj.gif': 'dancers'
  };
  for (var key in links) {
    if (links.hasOwnProperty(key)) {
      document.getElementById(links[key]).src = cloudinary + key
    }
  }

  // Perfs matters
  $('figure').on('mouseenter hover focus', function(){
    $(this).parent().find('> .ee img').css('visibility', 'visible')
  }).on('mouseleave', function(){
    $(this).parent().find('> .ee img').css('visibility','hidden')
  })
}


function ifSafari() {
  var isSafari = /constructor/i.test(window.HTMLElement);
  if(isSafari){
    document.body.classList.add('safari')
  }
}
function ifMobile(){
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
  ifMobile()
  ifSafari()
})
