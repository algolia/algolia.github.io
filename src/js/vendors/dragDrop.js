var Draggabilly = require('draggabilly');
var classie = require('classie');

;( function() {

	'use strict';

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
		onDrag : function() { return false; },
		onEnd : function(wasDropped) { return false; }
	}

	Draggable.prototype.initEvents = function() {
		this.draggie.on( 'dragStart', this.onDragStart.bind(this) );
		this.draggie.on( 'dragMove', throttle( this.onDragMove.bind(this), 5 ) );
		this.draggie.on( 'dragEnd', this.onDragEnd.bind(this) );
	}

	Draggable.prototype.onDragStart = function( instance) {
		//callback
		this.options.onStart();
		// save left & top
		this.position = { left : this.el.clientLeft, top : this.el.clientTop };
	}

	Draggable.prototype.onDragMove = function( instance ) {
		//callback
		this.options.onDrag();
		// scroll page if at viewport's edge
		if( this.options.scroll ) {
			this.scrollPage( instance.element );
		}
	}

	Draggable.prototype.onDragEnd = function(instance) {
		if( this.options.scroll ) {
			// reset this.scrollIncrement
			this.scrollIncrement = 0;
		}
		var dropped = false;
		//callback
		this.options.onEnd( dropped );
		var withAnimation = true;
		if( dropped ) {
			// add class is-dropped to draggable ( controls how the draggable appears again at its original position)
			classie.add( instance.element, 'is-dropped' );
			// after a timeout remove that class to trigger the transition
			setTimeout( function() {
				classie.add( instance.element, 'is-complete' );

				onEndTransition( instance.element, function() {
					classie.remove( instance.element, 'is-complete' );
					classie.remove( instance.element, 'is-dropped' );
				} );
			}, 25 );
		}
		// move back with animation - track if the element moved away from its initial position or if it was dropped in a droppable element
		if( this.position.left === instance.x && this.position.top === instance.y || dropped ) {
			// in this case we will not set a transition for the item to move back
			withAnimation = false;
		}
		// move back the draggable element (with or without a transition)
		this.moveBack( withAnimation );
	}


	Draggable.prototype._getTranslateVal = function( el ) {
			var h = Math.sqrt( Math.pow( el.position.x, 2 ) + Math.pow( el.position.y, 2 ) ),
				a = Math.asin( Math.abs( el.position.y ) / h ) / ( Math.PI / 180 ),
				hL = h + this.options.distDragBack,
				dx = Math.cos( a * ( Math.PI / 180 ) ) * hL,
				dy = Math.sin( a * ( Math.PI / 180 ) ) * hL,
				tx = dx - Math.abs( el.position.x ),
				ty = dy - Math.abs( el.position.y );

			return {
				x : el.position.x > 0 ? tx : tx * -1,
				y : el.position.y > 0 ? ty : ty * -1
			}
		};

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

	window.Draggable = Draggable;
})();

module.exports = Draggable;
