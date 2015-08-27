function Shoe360View() {

	this.init();

}

Shoe360View.prototype = {

	init: function () {

		this.emulateTouchEvents = true;
		this.initVars();
		this.attachEventListeners();
		this.loop();
		this.setProgressContainerSize();
		this.preloadImages();

	},

	initVars: function () {

		// since we're assigning a native method to a property of custom object,
		// when called change context to the context of window
		this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

		this.imageSequencerBox = document.querySelector('.image-sequencer-box');
		this.percentage = 0;
		this.circleProgress = 0;
		this.circlePath = document.querySelector('.circle-path');
		this.circlePathLength = this.circlePath.getTotalLength();
		this.calcCircleStroke();
		this.pointerOffsetDeg = 90;
		this.pointer = document.querySelector('.pointer');
		this.pointerSVG = this.pointer.querySelector('svg');
		this.imagesContainer = document.querySelector('.images-container');
		this.images = this.imagesContainer.querySelectorAll('img');
		this.touchStart = 0;
		this.touchEnd = 0;
		this.throttleMs = 75;
		this.queuedExecMs = 100;
		this.queueFnManager = this.getQueueFnManagerInstance();
		this.progressContainer = document.querySelector('.progress-container');
		this.svg = this.progressContainer.querySelector('svg');

		// place any functions that should be exec on win resize in the queue manager
		this.queueFnManager.push(this.setProgressContainerSize.bind(this));

	},

	attachEventListeners: function () {

		if (this.emulateTouchEvents) {

			var hammer = new Hammer(this.imageSequencerBox);

			hammer.on("panstart", this.panStartHandler.bind(this), false);
			hammer.on("panend", this.panEndHandler.bind(this), false);
			hammer.on("panmove", this.throttle(this.panMoveHandle.bind(this), this.throttleMs), false);

		} else {

			this.imageSequencerBox.addEventListener("touchstart", this.touchStartHandler.bind(this), false);
			this.imageSequencerBox.addEventListener("touchend", this.touchEndHandler.bind(this), false);
			this.imageSequencerBox.addEventListener("touchmove", this.throttle(this.touchMoveHandle.bind(this), this.throttleMs), false);

		}

		// detecting `touchscreen` is difficult, so we'll only set if indeed in use
		// todo: re-add event listener on window resize and set emulateTouchEvents to true
		window.addEventListener('touchstart', function setEmulateTouchEvents() {
			this.emulateTouchEvents = false;
			window.removeEventListener('touchstart', setEmulateTouchEvents);
		}.bind(this), false);

		// exec queued fn on page resize
		window.addEventListener('resize', this.throttle(this.queueFnManager.exec.bind(this.queueFnManager), this.queuedExecMs));

	},

	calcCircleStroke: function () {

		// Set up the starting positions
		this.circlePath.style.strokeDasharray = this.circlePathLength + ' ' + this.circlePathLength;
		this.circlePath.style.strokeDashoffset = this.circlePathLength;

	},

	setProgressPath: function (percentage) {

		var amt = (percentage / 100) * this.circlePathLength;
		this.circlePath.style['stroke-dashoffset'] = (this.circlePathLength - amt) + 'px';

		// update pointer position
		this.setProgressPointer(percentage);

	},

	setProgressPointer: function (percentage) {

		var totalDeg = 360,
			deg = totalDeg * (percentage / 100),
			deg = deg - this.pointerOffsetDeg;

		//this.pointer.style.transform = 'rotateZ(' + deg + 'deg)';
		this.pointer.style[Modernizr.prefixed('transform', this.style, false)] = 'rotate(' + deg + 'deg)';

	},

	setImageByPercentage: function (percentage) {

		var index = Math.ceil(this.images.length * (percentage / 100));

		if (index === 0) {
			return;
		}

		// hide all
		// todo: maybe it's better to change the zIndex using the `index` value that goes up
		// and only when reaching the `end` hide all. This should perform a bit better then
		// the current `hide all` display only current `index`
		// notes: the problem with the suggestion above is that when touch left/right
		// there's more operations to do
		for (var i = 0; i < this.images.length; i++) {
			this.images[i].style.display = 'none';

			// display current
			if (index === i) {
				this.images[i].style.display = 'block';
			}

		}

	},

	loop: function () {

		if (this.percentage >= 100) {
			this.percentage = 0;
		} else {
			this.percentage += 0.1;
		}

		this.setProgressPath(this.percentage);
		this.setImageByPercentage(this.percentage);

		if (typeof this.r === "undefined") {
			this.rAf = this.requestAnimationFrame.call(window, this.loop.bind(this));
		}

		//console.log(window.countFPS());

	},

	touchStartHandler: function (e) {

		this.touchStart = e.touches[0].pageX;
		this.cancelAnimationFrame.call(window, this.rAf);

	},

	touchEndHandler: function (e) {

		this.rAf = this.requestAnimationFrame.call(window, this.loop.bind(this));

	},

	touchMoveHandle: function (e) {

		e.preventDefault();

		var direction;

		// detect if moving left or right
		if (this.touchStart > e.touches[0].pageX) {

			// detect if the user changes initial direction
			if (this.touchEnd < e.touches[0].pageX) {
				this.touchStart = this.touchEnd;
			}

			direction = 'left';

		} else {

			// detect if the user changes initial direction
			if (this.touchEnd > e.touches[0].pageX) {
				this.touchStart = this.touchEnd;
			}

			direction = 'right';

		}

		this.setImageByTouchMove(direction);

		this.touchEnd = e.touches[0].pageX;

	},

	panStartHandler: function (e) {

		this.cancelAnimationFrame.call(window, this.rAf);

	},

	panEndHandler: function (e) {

		this.rAf = this.requestAnimationFrame.call(window, this.loop.bind(this));

	},

	panMoveHandle: function (e) {

		e.preventDefault();

		var direction;

		// detect if moving left or right
		if (e.deltaX > 0) {

			direction = 'left';

		} else {

			direction = 'right';

		}

		this.setImageByTouchMove(direction);

	},

	setImageByTouchMove: function (direction) {

		if (this.percentage < 0) {
			this.percentage = 100;
		} else if (this.percentage > 100) {
			this.percentage = 0;
		}

		this.percentage = direction === 'right' ? (this.percentage + 1) : (this.percentage - 1);

		this.setProgressPath(this.percentage);
		this.setImageByPercentage(this.percentage);

	},

	throttle: function (func, ms) {
		var last = 0;
			return function () {
				var a = arguments, t = this, now = +(new Date());
				//b/c last = 0 will still run the first time called
				if(now >= last + ms){
					last = now;
					func.apply(t, a);
				}
		};
	},

	getQueueFnManagerInstance: function () {

		var instance;

		function QueueFnManager() {
			this.queued = [];
		}

		QueueFnManager.prototype = {

			push: function (fn) {

				if (typeof fn === "function") {
					this.queued.push(fn);
				}

			},

			exec: function () {

				if (this.queued.length === 0) {
					return false;
				}

				this.queued.forEach(function (fn, index) {
					if (typeof fn === "function") {
						fn();
					}
				});

			}

		};

		if (!instance) {

			instance = new QueueFnManager();

		}

		return instance;

	},

	setProgressContainerSize: function () {

		this.imageSequencerBox.style.width = this.progressContainer.style.width = this.imagesContainer.style.width = window.innerWidth + 'px';
		this.imageSequencerBox.style.height = this.progressContainer.style.height = this.imagesContainer.style.height = window.innerWidth + 'px';
		//this.svg.setAttribute('viewBox', '-8 -8 ' + window.innerWidth + ' ' + window.innerWidth);
		this.pointer.style.height = (window.innerWidth / 2) + 'px';
		this.pointer.style.width = (window.innerWidth * 0.03) + 'px';
		this.pointer.style.marginLeft = -(window.innerWidth * 0.015) + 'px';
		this.pointerSVG.style.width = this.pointerSVG.style.height = (window.innerWidth * 0.03) + 'px';

	},

	preloadImages: function () {

		var imgLoad = imagesLoaded(this.imagesContainer);

		imgLoad.on( 'progress', function( instance, image ) {
			var result = image.isLoaded ? 'loaded' : 'broken';
			console.log( 'image is ' + result + ' for ' + image.img.src );
		});

		imgLoad.on( 'done', function( instance ) {
			console.log('DONE  - all images have been successfully loaded');
		});

		imgLoad.on( 'always', function( instance ) {
			console.log('ALWAYS - all images have been loaded');
		});

	}

};

document.addEventListener("DOMContentLoaded", function(e) {

	var shoe360View = new Shoe360View();

	window.shoe360View = shoe360View;

});

window.countFPS = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());