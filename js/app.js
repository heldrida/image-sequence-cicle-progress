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

		this.percentage = 0;
		this.circleProgress = 0;
		this.circlePath = document.querySelector('.circle-path');
		this.circlePathLength = this.circlePath.getTotalLength();
		this.calcCircleStroke();
		this.pointerOffsetDeg = 90;
		this.pointer = document.querySelector('.pointer');

	},

	attachEventListeners: function () {


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

	loop: function () {

		if (this.percentage >= 100) {
			this.percentage = 0;
		} else {
			this.percentage += 0.1;
		}

		this.setProgressPath(this.percentage);

		window.requestAnimationFrame(this.loop.bind(this));

	}

};

document.addEventListener("DOMContentLoaded", function(e) {

	var shoe360View = new Shoe360View();

	window.shoe360View = shoe360View;

});