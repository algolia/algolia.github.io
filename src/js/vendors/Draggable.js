// extracted from https://github.com/codrops/DragDropInteractions/blob/13cff0408bfd78a47e70598a7fbbcae42ae09bdb/js/dragdrop.js
// modified to be commonJS compatible = get dependencies from "require" rather than window

var Draggabilly = require('draggabilly');
var classie = require('classie');

// we load only what we need, you can use anything in https://github.com/jnordberg/browsernizr
require('browsernizr/test/css/transitions.js');
require('browsernizr/lib/prefixed.js')
var Modernizr = require('browsernizr');

var body = document.body, docElem = window.document.documentElement,
	transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
	transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
	support = { transitions : Modernizr.csstransitions };

// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last,
		deferTimer;

	return function () {
		var context = scope || this;
		var now = +new Date,
		args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function () {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}
// from http://responsejs.com/labs/dimensions/

function setTransformStyle( el, tval ) { el.style.transform = tval; }
function onEndTransition( el, callback ) {
	var onEndCallbackFn = function( ev ) {
		if( support.transitions ) {
			this.removeEventListener( transEndEventName, onEndCallbackFn );
		}
		if( callback && typeof callback === 'function' ) { callback.call(); }
	};

	if( support.transitions ) {
		el.addEventListener( transEndEventName, onEndCallbackFn );
	}
	else {
		onEndCallbackFn();
	}
}
function extend( a, b ) {
	for( var key in b ) {
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

/*************************************************************/
/************************ Drag & Drop ************************/
/*************************************************************/

var is3d = false;

/***************/
/** Draggable **/
/***************/

function Draggable( draggableEl, droppables, options ) {
	this.el = draggableEl;
	this.options = extend( {}, this.options );
	extend( this.options, options );
	this.droppables = droppables;
	this.scrollableEl = this.options.scrollable === window ? window : document.querySelector( this.options.scrollable );
	this.scrollIncrement = 0;
	this.draggie = new Draggabilly( this.el, this.options.draggabilly );
	this.initEvents();
}

Draggable.prototype.options = {
	// auto scroll when dragging
	scroll: false,
	// element to scroll
	scrollable : window,
	// scroll speed (px)
	scrollSpeed : 20,
	// minimum distance to the scrollable element edges to trigger the scroll
	scrollSensitivity : 10,
	// draggabilly options
	draggabilly : {},
	// if the item should animate back to its original position
	animBack : true,
	// callbacks
	onStart : function() { return false; },
	onEnd : function(wasDropped) { return false; }
}

Draggable.prototype.initEvents = function() {
	this.draggie.on( 'dragStart', this.onDragStart.bind(this) );
	this.draggie.on( 'dragEnd', this.onDragEnd.bind(this) );
	this.draggie.on( 'pointerDown', this.onPointerDown.bind(this) );
	this.draggie.on( 'pointerUp', this.onPointerUp.bind(this) );
}

Draggable.prototype.onPointerDown = function() {
	var el = this.el
	setTimeout(function() {
		classie.add(el,"drag");
	}, 800);
}

Draggable.prototype.onPointerUp = function() {
	var el = this.el
	setTimeout(function() {
		classie.remove( el, "drag" );
	}, 200);
}

Draggable.prototype.onDragStart = function( instance) {
	//callback
	this.options.onStart();
	// save left & top
	this.position = { left : this.el.clientLeft, top : this.el.clientTop };
}


Draggable.prototype.onDragEnd = function(instance) {

	if( this.options.scroll ) {
		// reset this.scrollIncrement
		this.scrollIncrement = 0;
	}
	var dropped = false;
	//callback
	this.options.onEnd( dropped );

	// move back with animation - track if the element moved away from its initial position or if it was dropped in a droppable element
	if( this.position.left === instance.x && this.position.top === instance.y || dropped ) {
		// in this case we will not set a transition for the item to move back
		withAnimation = false;
	}
	// move back the draggable element (with or without a transition)
	this.moveBack( true );
}

// move back the draggable to its original position
Draggable.prototype.moveBack = function( withAnimation ) {
	var anim = this.options.animBack && withAnimation;
	// add animate class (where the transition is defined)
	if( anim ) {
		classie.add( this.el, 'animate' );
	}
	// reset translation value
	setTransformStyle( this.el, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
	// apply original left/top
	this.el.style.left = this.position.left + 'px';
	this.el.style.top = this.position.top + 'px';
	// remove class animate (transition) and is-active to the draggable element (z-index)
	var callbackFn = function() {
		if( anim ) {
			classie.remove( this.el, 'animate' );
		}
		classie.remove( this.el, 'is-active' );
		if( this.options.helper ) {
			body.removeChild( this.el );
		}
	}.bind( this );

	if( anim ) {
		onEndTransition( this.el, callbackFn );
	}
	else {
		callbackFn();
	}
}

module.exports = Draggable;
