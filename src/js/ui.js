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



function isMobile(){
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		var wrappers = document.querySelectorAll('figure');
		for(i=0;i<wrappers.length;i++) {
			wrappers[i].classList.remove('draggable')
		}
	}
}

window.addEventListener('load', function(){
	isMobile()
})

document.addEventListener('DOMContentLoaded', function(){
	isMobile()
})