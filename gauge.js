/*
 * HTML5 Canvas Gauge implementation
 * 
 * This code is subject to MIT license.
 *
 * Copyright (c) 2012 Mykhailo Stadnyk <mikhus@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var Gauge = function( config) {

	/**
	 *  Default gauge configuration
	 */
	this.config = {
		renderTo    : null,
		width       : 200,
		height      : 200,
		title       : false,
		maxValue    : 100,
		minValue    : 0,
		majorTicks  : ['0', '20', '40', '60', '80', '100'],
		minorTicks  : 10,
		strokeTicks : true,
		units       : false,
		valueFormat : { int : 3, dec : 2 },
		glow        : true,
		animation   : {
			delay    : 10,
			duration : 250,
			fn       : 'cycle'
		},
		colors : {
			plate      : '#fff',
			majorTicks : '#444',
			minorTicks : '#666',
			title      : '#888',
			units      : '#888',
			numbers    : '#444',
			needle     : { start : 'rgba(240, 128, 128, 1)', end : 'rgba(255, 160, 122, .9)' }
		},
		highlights  : [{
			from  : 20,
			to    : 60,
			color : '#eee'
		}, {
			from  : 60,
			to    : 80,
			color : '#ccc'
		}, {
			from  : 80,
			to    : 100,
			color : '#999'
		}]
	};

	var
		value     = 0,
		self      = this,
		fromValue = 0,
		toValue   = 0,
		imready   = false
	;

	/**
	 * Sets a new value to gauge and updates the gauge view
	 * 
	 * @param {Number} val  - the new value to set to the gauge
	 * @return {Gauge} this - returns self
	 */
	this.setValue = function( val) {

		fromValue = config.animation ? value : val;

		var dv = (config.maxValue - config.minValue) / 100;

		toValue = val > config.maxValue ?
			toValue = config.maxValue + dv :
				val < config.minValue ?
					config.minValue - dv : 
						val
		;

		value = val;

		config.animation ? animate() : this.draw();

		return this;
	};

	/**
	 * Clears the value of the gauge
	 * @return {Gauge}
	 */
	this.clear = function() {
		value = fromValue = toValue = this.config.minValue;
		this.draw();
		return this;
	};

	/**
	 * Returns the current value been set to the gauge
	 * 
	 * @return {Number} value - current gauge's value
	 */
	this.getValue = function() {
		return value;
	};

	/**
	 * Ready event for the gauge. Use it whenever you
	 * initialize the gauge to be assured it was fully drawn
	 * before you start the update on it
	 * 
	 * @event {Function} onready
	 */
	this.onready = function() {};

	function applyRecursive( dst, src) {
		for (var i in src) {
			if (typeof src[i] == "object" && !(src[i] instanceof Array)) {
				if (typeof dst[i] != "object") {
					dst[i] = {};
				}

				applyRecursive( dst[i], src[i]);
			} else {
				dst[i] = src[i];
			}
		}
	};

	applyRecursive( this.config, config);
	config = this.config;
	fromValue = value = config.minValue;

	if (!config.renderTo) {
		throw Error( "Canvas element was not specified when creating the Gauge object!");
	}

	var
		canvas = config.renderTo.tagName ? config.renderTo : document.getElementById( config.renderTo),
		ctx = canvas.getContext( '2d'),
		cache, CW, CH, CX, CY, max
	;

	function baseInit() {
		canvas.width  = config.width;
		canvas.height = config.height;

		cache = canvas.cloneNode( true);
		cctx = cache.getContext( '2d');
		CW  = canvas.width;
		CH  = canvas.height;
		CX  = CW / 2;
		CY  = CH / 2;
		max = CX < CY ? CX : CY;
		
		cache.i8d = false;

		// translate cache to have 0, 0 in center
		cctx.translate( CX, CY);
		cctx.save();

		// translate canvas to have 0,0 in center
		ctx.translate( CX, CY);
		ctx.save();
	};

	// do basic initialization
	baseInit();

	/**
	 * Updates the gauge config
	 *
	 * @param  {Object} config
	 * @return {Gauge}
	 */
	this.updateConfig = function( config) {
        applyRecursive( this.config, config);
        baseInit();
        this.draw();
        return this;
    };

	var animateFx = {
		linear : function( p) { return p; },
		quad   : function( p) { return Math.pow( p, 2); },
		quint  : function( p) { return Math.pow( p, 5); },
		cycle  : function( p) { return 1 - Math.sin( Math.acos( p)); },
		bounce : function( p) {
			return 1 - (function( p) {
				for(var a = 0, b = 1; 1; a += b, b /= 2) {
					if (p >= (7 - 4 * a) / 11) {
						return -Math.pow((11 - 6 * a - 11 * p) / 4, 2) + Math.pow(b, 2);
					}
				}
			})( 1 - p);
		},
		elastic : function( p) {
			return 1 - (function( p) {
				var x = 1.5;
				return Math.pow( 2, 10 * (p - 1)) * Math.cos( 20 * Math.PI * x / 3 * p);
			})( 1 - p);
		}
	};

	var animateInterval = null;

	function _animate( opts) {
		var start = new Date; 

		animateInterval = setInterval( function() {
			var
				timePassed = new Date - start,
				progress = timePassed / opts.duration
			;

			if (progress > 1) {
				progress = 1;
			}

			var animateFn = typeof opts.delta == "function" ?
				opts.delta :
				animateFx[opts.delta]
			;

			var delta = animateFn( progress);
			opts.step( delta);

			if (progress == 1) {
				clearInterval( animateInterval);
			}
		}, opts.delay || 10);
	};

	function animate() {
		animateInterval && clearInterval( animateInterval); // stop previous animation
		var
			path = (toValue - fromValue),
			from = fromValue,
			cfg  = config.animation
		;

		_animate({
			delay    : cfg.delay,
			duration : cfg.duration,
			delta    : cfg.fn,
			step     : function( delta) { fromValue = from + path * delta; self.draw(); }
		});
	};

	// defaults
	ctx.lineCap = "round";

	/**
	 * Drows the gauge. Normally this function should be used to
	 * initally draw the gauge
	 * 
	 * @return {Gauge} this - returns the self Gauge object
	 */
	this.draw = function() {
		if (!cache.i8d) {
			// clear the cache
			cctx.clearRect( -CX, -CY, CW, CH);
			cctx.save();

			var tmp = ctx;
			ctx = cctx;

			drawPlate();
			drawHighlights();
			drawMinorTicks();
			drawMajorTicks();
			drawNumbers();
			drawTitle();
			drawUnits();

			cache.i8d = true;
			ctx = tmp;
			delete tmp;
		}

		// clear the canvas
		ctx.clearRect( -CX, -CY, CW, CH);
		ctx.save();

		ctx.drawImage( cache, -CX, -CY, CW, CH);

		if (!Gauge.initialized) {
			var iv = setInterval(function() {
				if (!Gauge.initialized) {
					return;
				}

				clearInterval( iv);

				drawValueBox();
				drawNeedle();

				if (!imready) {
					self.onready && self.onready();
					imready = true;
				}
			}, 10);
		} else {
			drawValueBox();
			drawNeedle();

			if (!imready) {
				self.onready && self.onready();
				imready = true;
			}
		}

		return this;
	};

	/**
	 * Transforms degrees to radians
	 */
	function radians( degrees) {
		return degrees * Math.PI / 180;
	};

	/**
	 * Linear gradient
	 */
	function lgrad( clrFrom, clrTo, len) {
		var grad = ctx.createLinearGradient( 0, 0, 0, len);  
		grad.addColorStop( 0, clrFrom);  
		grad.addColorStop( 1, clrTo);

		return grad;
	};

	function drawPlate() {
		var
			r0 = max / 100 * 93,
			d0 = max -r0,
			r1 = max / 100 * 91,
			d1 = max - r1,
			r2 = max / 100 * 88,
			d2 = max - r2;
			r3 = max / 100 * 85
		;

		ctx.save();

		if (config.glow) {
			ctx.shadowBlur  = d0;
			ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
		}

		ctx.beginPath();
		ctx.arc( 0, 0, r0, 0, Math.PI * 2, true);
		ctx.fillStyle = lgrad( '#ddd', '#aaa', r0);
		ctx.fill();

		ctx.restore();

		ctx.beginPath();
		ctx.arc( 0, 0, r1, 0, Math.PI * 2, true);
		ctx.fillStyle = lgrad( '#fafafa', '#ccc', r1);
		ctx.fill();

		ctx.beginPath();
		ctx.arc( 0, 0, r2, 0, Math.PI * 2, true);
		ctx.fillStyle = lgrad( '#eee', '#f0f0f0', r2);
		ctx.fill();
	
		ctx.beginPath();
		ctx.arc( 0, 0, r3, 0, Math.PI * 2, true);
		ctx.fillStyle = config.colors.plate;
		ctx.fill();

		ctx.save();
	};

	// major ticks draw
	function drawMajorTicks() {
		var r = max / 100 * 81;

		ctx.lineWidth = 2;
		ctx.strokeStyle = config.colors.majorTicks;
		ctx.save();

		for (var i = 0; i < config.majorTicks.length; ++i) {
			var a = 45 + i * (270 / (config.majorTicks.length - 1));
			ctx.rotate( radians( a));

			ctx.beginPath();
			ctx.moveTo( 0, r);
			ctx.lineTo( 0, r - max / 100 * 15);
			ctx.stroke();

			ctx.restore();
			ctx.save();
		}

		if (config.strokeTicks) {
			ctx.rotate( radians( 90));

			ctx.beginPath();
			ctx.arc( 0, 0, r, radians( 45), radians( 315), false);
			ctx.stroke();
			ctx.restore();
	
			ctx.save();
		}
	};

	// minor ticks draw
	function drawMinorTicks() {
		var r = max / 100 * 81;

		ctx.lineWidth = 1;
		ctx.strokeStyle = config.colors.minorTicks;

		ctx.save();

		var len = config.minorTicks * (config.majorTicks.length - 1);

		for (var i = 0; i < len; ++i) {
			var a = 45 + i * (270 / len);
			ctx.rotate( radians( a));

			ctx.beginPath();
			ctx.moveTo( 0, r);
			ctx.lineTo( 0, r - max / 100 * 7.5);
			ctx.stroke();

			ctx.restore();
			ctx.save();
		}
	};

	// tick numbers draw
	function drawNumbers() {
		var r = max / 100 * 55;

		for (var i = 0; i < config.majorTicks.length; ++i) {
			var 
				a = 45 + i * (270 / (config.majorTicks.length - 1)),
				p = rpoint( r, radians( a))
			;

			ctx.font      = 20 * (max / 200) + "px Arial";
			ctx.fillStyle = config.colors.numbers;
			ctx.lineWidth = 0;
			ctx.textAlign = "center";
			ctx.fillText( config.majorTicks[i], p.x, p.y + 3);
		}
	};

	// title draw
	function drawTitle() {
		if (!config.title) {
			return;
		}

		ctx.save();
		ctx.font = 24 * (max / 200) + "px Arial";
		ctx.fillStyle = config.colors.title;
		ctx.textAlign = "center";
		ctx.fillText( config.title, 0, -max / 4.25);
		ctx.restore();
	};

	// units draw
	function drawUnits() {
		if (!config.units) {
			return;
		}

		ctx.save();
		ctx.font = 22 * (max / 200) + "px Arial";
		ctx.fillStyle = config.colors.units;
		ctx.textAlign = "center";
		ctx.fillText( config.units, 0, max / 3.25);
		ctx.restore();
	};

	function padValue( val) {
		var
			cdec = config.valueFormat.dec,
			cint = config.valueFormat.int
		;
		val = parseFloat( val);

		var n = (val < 0);

		val = Math.abs( val);

		if (cdec > 0) {
			val = val.toFixed( cdec).toString().split( '.');
	
			for (var i = 0, s = cint - val[0].length; i < s; ++i) {
				val[0] = '0' + val[0];
			}

			val = (n ? '-' : '') + val[0] + '.' + val[1];
		} else {
			val = Math.round( val).toString();

			for (var i = 0, s = cint - val.length; i < s; ++i) {
				val = '0' + val;
			}

			val = (n ? '-' : '') + val
		}

		return val;
	};

	function rpoint( r, a) {
		var 
			x = 0, y = r,

			sin = Math.sin( a),
			cos = Math.cos( a),

			X = x * cos - y * sin,
			Y = x * sin + y * cos
		;

		return { x : X, y : Y };
	};

	// draws the highlight colors
	function drawHighlights() {
		ctx.save();

		var r1 = max / 100 * 81;
		var r2 = r1 - max / 100 * 15;

		for (var i = 0, s = config.highlights.length; i < s; i++) {
			var
				hlt = config.highlights[i],
				vd = (config.maxValue - config.minValue) / 270,
				sa = radians( 45 + (hlt.from - config.minValue) / vd),
				ea = radians( 45 + (hlt.to - config.minValue) / vd)
			;
			
			ctx.beginPath();
	
			ctx.rotate( radians( 90));
			ctx.arc( 0, 0, r1, sa, ea, false);
			ctx.restore();
			ctx.save();
	
			var
				ps = rpoint( r2, sa),
				pe = rpoint( r1, sa)
			;
			ctx.moveTo( ps.x, ps.y);
			ctx.lineTo( pe.x, pe.y);
	
			var
				ps1 = rpoint( r1, ea),
				pe1 = rpoint( r2, ea)
			;
	
			ctx.lineTo( ps1.x, ps1.y);
			ctx.lineTo( pe1.x, pe1.y);
			ctx.lineTo( ps.x, ps.y);
	
			ctx.closePath();
	
			ctx.fillStyle = hlt.color;
			ctx.fill();
	
			ctx.beginPath();
			ctx.rotate( radians( 90));
			ctx.arc( 0, 0, r2, sa - 0.2, ea + 0.2, false);
			ctx.restore();
	
			ctx.closePath();
	
			ctx.fillStyle = config.colors.plate;
			ctx.fill();
			ctx.save();
		}
	};

	// drows the gauge needle
	function drawNeedle() {
		var
			r1 = max / 100 * 12,
			r2 = max / 100 * 8,

			rIn  = max / 100 * 77,
			rOut = max / 100 * 20,
			pad1 = max / 100 * 4,
			pad2 = max / 100 * 2,

			shad = function() {
				ctx.shadowOffsetX = 2;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur    = 10;
				ctx.shadowColor   = 'rgba(188, 143, 143, 0.45)';
			}
		;

		ctx.save();

		shad();
		
		if (fromValue < 0) {
			fromValue = Math.abs(config.minValue - fromValue);
		} else {
			fromValue = Math.abs(config.minValue) + fromValue;
		}

		ctx.rotate( radians( 45 + fromValue / ((config.maxValue - config.minValue) / 270)));

		ctx.beginPath();
		ctx.moveTo( -pad2, -rOut);
		ctx.lineTo( -pad1, 0);
		ctx.lineTo( -1, rIn);
		ctx.lineTo( 1, rIn);
		ctx.lineTo( pad1, 0);
		ctx.lineTo( pad2, -rOut);
		ctx.closePath();

		ctx.fillStyle = lgrad(
			config.colors.needle.start,
			config.colors.needle.end,
			rIn - rOut
		);
		ctx.fill();

		ctx.beginPath();
		ctx.lineTo( -0.5, rIn);
		ctx.lineTo( -1, rIn);
		ctx.lineTo( -pad1, 0);
		ctx.lineTo( -pad2, -rOut);
		ctx.lineTo( pad2 / 2 - 2, -rOut);
		ctx.closePath();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.fill();

		ctx.restore();

		shad();

		ctx.beginPath();
		ctx.arc( 0, 0, r1, 0, Math.PI * 2, true);
		ctx.fillStyle = lgrad( '#f0f0f0', '#ccc', r1);
		ctx.fill();

		ctx.restore();

		ctx.beginPath();
		ctx.arc( 0, 0, r2, 0, Math.PI * 2, true);
		ctx.fillStyle = lgrad( "#e8e8e8", "#f5f5f5", r2);
		ctx.fill();
	};

	function roundRect( x, y, w, h, r) {
		ctx.beginPath();

		ctx.moveTo( x + r, y);
		ctx.lineTo( x + w - r, y);

		ctx.quadraticCurveTo( x + w, y, x + w, y + r);
		ctx.lineTo( x + w, y + h - r);

		ctx.quadraticCurveTo( x + w, y + h, x + w - r, y + h);
		ctx.lineTo( x + r, y + h);

		ctx.quadraticCurveTo( x, y + h, x, y + h - r);
		ctx.lineTo( x, y + r);

		ctx.quadraticCurveTo( x, y, x + r, y);

		ctx.closePath();
	};

	// value box draw
	function drawValueBox() {
		ctx.save();
		
		ctx.font = 40 * (max / 200) + "px Led";

		var
			text = padValue( value),
			tw   = ctx.measureText( '-' + padValue( 0)).width,
			y = max - max / 100 * 33,
			x = 0,
			th = 0.12 * max
		;

		ctx.save();

		roundRect(
			-tw / 2 - 0.025 * max,
			y - th - 0.04 * max,
			tw + 0.05 * max,
			th + 0.07 * max,
			0.025 * max
		);

		var grd = ctx.createRadialGradient(
			x,
			y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2,
			max / 10,
			x,
			y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2,
			max / 5
		);

		grd.addColorStop( 0, "#888");
	    grd.addColorStop( 1, "#666");

		ctx.strokeStyle = grd;
		ctx.lineWidth = 0.05 * max;
		ctx.stroke();

		ctx.shadowBlur  = 0.012 * max;
		ctx.shadowColor = 'rgba(0, 0, 0, 1)';

		ctx.fillStyle = "#babab2";
		ctx.fill();
		
		ctx.restore();

		ctx.shadowOffsetX = 0.004 * max;
		ctx.shadowOffsetY = 0.004 * max;
		ctx.shadowBlur    = 0.012 * max;
		ctx.shadowColor   = 'rgba(0, 0, 0, 0.3)';

		ctx.fillStyle = "#444";
		ctx.textAlign = "center";
		ctx.fillText( text, -x, y);

		ctx.restore();
	};
};

// initialize
Gauge.initialized = false;
(function(){
	var
		d = document,
		h = d.getElementsByTagName('head')[0],
		ie = navigator.userAgent.toLocaleLowerCase().indexOf( 'msie') != -1,
		url = 'http://smart-ip.net/styles/fonts/digital-7-mono.' + (ie ? 'eot' : 'ttf'),
		text = "@font-face {" +
					"font-family: 'Led';" +
					"src: url('" + url + "');" +
				"}",
		ss,
		r = d.createElement( 'style')
	;

	r.type = 'text/css';

	if (ie) {
		h.appendChild( r);
		ss = r.styleSheet;
		ss.cssText = text;
    } else {
    	try {
    		r.appendChild( d.createTextNode( text));
    	} catch (e) {
    		r.cssText = text;
    	}

    	h.appendChild( r);

    	ss = r.styleSheet ? r.styleSheet :
    		(r.sheet || d.styleSheets[d.styleSheets.length - 1])
    	;
	}

	var iv = setInterval(function() {
		if (!d.body) {
			return;
		}

		clearInterval( iv);

		var dd = d.createElement( 'div');

		dd.style.fontFamily = 'Led';
		dd.style.position   = 'absolute';
		dd.style.height     = dd.style.width = 0;
		dd.style.overflow   = 'hidden';

		dd.innerHTML = '.';

		d.body.appendChild( dd);

		setTimeout(function() { // no other way to handle font is rendered by a browser
			                    // just give the browser around 250ms to do that :(
			Gauge.initialized = true;
			dd.parentNode.removeChild( dd);
		}, 250);
	}, 1);
})();
