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

window.pardotAppendIframe = function pardotAppendIframe(url) {
  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = 1;
  iframe.height = 1;
  document.body.appendChild(iframe);
};

$('#mc_embed_signup').on('submit', function success(event) {
  event.preventDefault();
  var $signupForm = $('#mc_embed_signup');
  var $message = $('.mc-signupmessage');
  var email = $('#mce-EMAIL').val();
  if (email) {
    window.pardotAppendIframe('https://go.algolia.com/l/139121/2016-06-09/f3kzm?email=' + encodeURI(email));
    $signupForm.addClass('mc_embed_signup--success');
    $message.html('Thank you for subscribing <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 36 35"><path d="M18 4.02C16.552 2.25 14.057.297 10.103.297 3.373.297 0 6.63 0 12.547c0 9.776 15.135 20.15 16.99 21.435.607.422 1.413.422 2.02 0C20.864 32.695 36 22.322 36 12.546 36 6.63 32.627.298 25.896.298c-3.953 0-6.448 1.954-7.896 3.72v.002z" fill="#fb366e" fill-rule="evenodd"/></svg>');
  }
});

window.addEventListener('load', function(){
  ifMobile()
  ifSafari()
})
