function Shoe360View() {

	this.init();

}

Shoe360View.prototype = {

	init: function () {

		this.initVars();
		this.attachEventListeners();
		this.loop();

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
		this.images = document.querySelectorAll('.images-container img');

	},

	attachEventListeners: function () {

		this.imageSequencerBox.addEventListener("touchstart", this.touchStartHandler.bind(this), false);
		this.imageSequencerBox.addEventListener("touchend", this.touchEndHandler.bind(this), false);

		/*
		this.imageSequencerBox.addEventListener("touchmove", this.handleMove.bind(this), false);
		this.imageSequencerBox.addEventListener("touchend", handleEnd, false);
		this.imageSequencerBox.addEventListener("touchcancel", handleCancel, false);
		this.imageSequencerBox.addEventListener("touchleave", handleEnd, false);
		*/

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

		this.pointer.style.transform = 'rotateZ(' + deg + 'deg)';

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

		this.cancelAnimationFrame.call(window, this.rAf);

	},

	touchEndHandler: function (e) {

		this.rAf = this.requestAnimationFrame.call(window, this.loop.bind(this));

	},

	touchMoveHandle: function (e) {

		console.log(e);

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