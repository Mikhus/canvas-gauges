/*!
 * @license
 * Minimalistic HTML5 Canvas Gauge implementation
 *
 * This code is subject to MIT license.
 *
 * Copyright (c) 2012 Mykhailo Stadnyk <mikhus@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
require('./polyfill');

const GenericOptions = require('./GenericOptions');
const BaseGauge = require('./BaseGauge');
const SmartCanvas = require('./SmartCanvas');
const drawings = require('./drawings');

const PI = Math.PI;
const HPI = PI / 2;

/**
 * Gauge configuration options
 *
 * @typedef {GenericOptions|{ticksAngle: number, startAngle: number, colorNeedleCircleOuter: string, colorNeedleCircleOuterEnd: string, colorNeedleCircleInner: string, colorNeedleCircleInnerEnd: string, needleCircleSize: number, needleCircleInner: boolean, needleCircleOuter: boolean}} RadialGaugeOptions
 */

/**
 * Default gauge configuration options
 *
 * @access private
 * @type {RadialGaugeOptions}
 */
const defaultRadialGaugeOptions = Object.assign({}, GenericOptions, {
    // basic options
    ticksAngle: 270,
    startAngle: 45,

    // colors
    colorNeedleCircleOuter: '#f0f0f0',
    colorNeedleCircleOuterEnd: '#ccc',
    colorNeedleCircleInner: '#e8e8e8',
    colorNeedleCircleInnerEnd: '#f5f5f5',

    // needle
    needleCircleSize: 10,
    needleCircleInner: true,
    needleCircleOuter: true
});

/* istanbul ignore next: private, not testable */
/**
 * Draws gradient-filled circle on a canvas
 *
 * @access private
 * @param {number} radius
 * @param {Canvas2DContext} context
 * @param {string} start gradient start color
 * @param {string} end gradient end color
 */
function drawRadialCircle(radius, context, start, end) {
    context.beginPath();
    context.arc(0, 0, radius, 0, PI * 2, true);
    context.fillStyle = drawings.linearGradient(context, start, end, radius);
    context.fill();
    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Returns max radius without borders for the gauge
 *
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 * @return {number}
 */
function maxRadialRadius(context, options) {
    if (!context.maxRadius) {
        context.maxRadius = context.max
            - options.borderShadowWidth
            - options.borderOuterWidth
            - options.borderMiddleWidth
            - options.borderInnerWidth;
    }

    return context.maxRadius;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge plate on the canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialPlate(context, options) {
    let d0 = options.borderShadowWidth;
    let r0 = context.max -  options.borderShadowWidth;
    let r1 = r0 - options.borderOuterWidth;
    let r2 = r1 - options.borderMiddleWidth;
    let r3 = maxRadialRadius(context, options);

    context.save();

    if (options.borderOuterWidth) {
        drawRadialCircle(r0, context,
            options.colorBorderOuter,
            options.colorBorderOuterEnd);
    }

    if (options.borderMiddleWidth) {
        drawRadialCircle(r1, context,
            options.colorBorderMiddle,
            options.colorBorderMiddleEnd);
    }

    if (options.borderInnerWidth) {
        drawRadialCircle(r2, context,
            options.colorBorderInner,
            options.colorBorderInnerEnd);
    }

    if (d0) {
        context.shadowBlur = d0;
        context.shadowColor = options.colorBorderShadow;
    }

    context.beginPath();
    context.arc(0, 0, r3, 0, PI * 2, true);
    context.fillStyle = options.colorPlate;
    context.fill();
    context.closePath();

    context.restore();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge highlight areas on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialHighlights(context, options) {
    context.save();

    let r1 = radialTicksRadius(context, options);
    let r2 = r1 - context.max * .15;
    let i = 0, s = options.highlights.length;

    for (; i < s; i++) {
        let hlt = options.highlights[i];
        let vd = (options.maxValue - options.minValue) / options.ticksAngle;
        let sa = drawings.radians(options.startAngle +
                (hlt.from - options.minValue) / vd);
        let ea = drawings.radians(options.startAngle +
            (hlt.to - options.minValue) / vd);
        let ps = drawings.radialPoint(r2, sa);
        let pe = drawings.radialPoint(r1, sa);
        let ps1 = drawings.radialPoint(r1, ea);
        let pe1 = drawings.radialPoint(r2, ea);

        context.beginPath();
        context.rotate(HPI);
        context.arc(0, 0, r1, sa, ea, false);
        context.restore();
        context.save();
        context.moveTo(ps.x, ps.y);
        context.lineTo(pe.x, pe.y);
        context.lineTo(ps1.x, ps1.y);
        context.lineTo(pe1.x, pe1.y);
        context.lineTo(ps.x, ps.y);
        context.closePath();

        context.fillStyle = hlt.color;
        context.fill();

        context.beginPath();
        context.rotate(HPI);
        context.arc(0, 0, r2, sa - 0.2, ea + 0.2, false);
        context.restore();
        context.closePath();

        context.fillStyle = options.colorPlate;
        context.fill();
        context.save();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws minor ticks bar on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialMinorTicks(context, options) {
    let radius = radialTicksRadius(context, options);

    context.lineWidth = SmartCanvas.pixelRatio;
    context.strokeStyle = options.colorMinorTicks;

    context.save();

    let s = options.minorTicks * (options.majorTicks.length - 1);
    let i = 0;

    for (; i < s; ++i) {
        let angle = options.startAngle + i * (options.ticksAngle / s);

        context.rotate(drawings.radians(angle));

        context.beginPath();
        context.moveTo(0, radius);
        context.lineTo(0, radius - context.max * .075);
        closeStrokedPath(context);
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Returns ticks radius
 *
 * @access private
 * @param context
 * @param options
 * @return {number}
 */
function radialTicksRadius(context, options) {
    return maxRadialRadius(context, options) - context.max * .05;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge major ticks bar on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialMajorTicks(context, options) {
    let r = radialTicksRadius(context, options);
    let i;
    let s = options.majorTicks.length;
    let pixelRatio = SmartCanvas.pixelRatio;

    context.lineWidth = 2 * pixelRatio;
    context.strokeStyle = options.colorMajorTicks;
    context.save();

    if (s === 0) {
        options.majorTicks.push(drawings.formatMajorTickNumber(
            options.minValue, options));
        options.majorTicks.push(drawings.formatMajorTickNumber(
            options.maxValue, options));
        s = 2;
    }

    i = 0;
    for (; i < s; ++i) {
        context.rotate(drawings.radians(radialNextAngle(options, i, s)));

        context.beginPath();
        context.moveTo(0, r);
        context.lineTo(0, r - context.max * .15);
        closeStrokedPath(context);
    }

    if (options.strokeTicks) {
        context.rotate(HPI);

        context.beginPath();
        context.arc(0, 0, r,
            drawings.radians(options.startAngle),
            drawings.radians(options.startAngle + options.ticksAngle),
            false
        );
        closeStrokedPath(context);
    }
}

/* istanbul ignore next: private, not testable */
function radialNextAngle(options, i, s) {
    return options.startAngle + i * (options.ticksAngle / (s - 1));
}

/* istanbul ignore next: private, not testable */
/**
 * Strokes, closes path and restores previous context state
 *
 * @param {Canvas2DContext} context
 */
function closeStrokedPath(context) {
    context.stroke();
    context.restore();
    context.closePath();
    context.save();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge bar numbers
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialNumbers(context, options) {
    let radius = maxRadialRadius(context, options) - context.max * .35;
    let points = {};
    let i = 0;
    let s = options.majorTicks.length;

    for (; i < s; ++i) {
        let angle = radialNextAngle(options, i, s);
        let point = drawings.radialPoint(radius, drawings.radians(angle));

        if (angle === 360) angle = 0;

        if (points[angle]) {
            continue; //already drawn at this place, skipping
        }

        points[angle] = true;

        context.font = 20 * (context.max / 200) + 'px ' + options.fontNumbers;
        context.fillStyle = options.colorNumbers;
        context.lineWidth = 0;
        context.textAlign = 'center';
        context.fillText(options.majorTicks[i], point.x, point.y + 3);
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge title
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialTitle(context, options) {
    if (!options.title) return;

    context.save();
    context.font = 24 * (context.max / 200) + 'px ' + options.fontTitle;
    context.fillStyle = options.colorTitle;
    context.textAlign = 'center';
    context.fillText(options.title, 0, -context.max / 4.25, context.max * .8);
    context.restore();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws units name on the gauge
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialUnits(context, options) {
    if (!options.units) return;

    context.save();
    context.font = 22 * (context.max / 200) + 'px ' + options.fontUnits;
    context.fillStyle = options.colorUnits;
    context.textAlign = 'center';
    context.fillText(options.units, 0, context.max / 3.25, context.max * .8);
    context.restore();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge needle
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialNeedle(context, options) {
    if (!options.needle) return;

    let value = options.value;
    let max = maxRadialRadius(context, options);
    let r1 = max / 100 * options.needleCircleSize;
    let r2 = max / 100 * options.needleCircleSize * 0.75;
    let rIn = max / 100 * options.needleEnd;
    let rStart = options.needleStart ?
            max / 100 * options.needleStart : 0,
            rOut = max * .2;
    let pad1 = max / 100 * options.needleWidth;
    let pad2 = max / 100 * options.needleWidth / 2;
    let pixelRatio = SmartCanvas.pixelRatio;

    context.save();

    drawings.drawNeedleShadow(context, options);

    context.rotate(drawings.radians(
        options.startAngle + (value - options.minValue) /
        (options.maxValue - options.minValue) * options.ticksAngle));

    context.fillStyle = drawings.linearGradient(
        context,
        options.colorNeedle,
        options.colorNeedleEnd,
        rIn - rOut);

    if (options.needleType === 'arrow') {
        context.beginPath();
        context.moveTo(-pad2, -rOut);
        context.lineTo(-pad1, 0);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(pixelRatio, rIn);
        context.lineTo(pad1, 0);
        context.lineTo(pad2, -rOut);
        context.closePath();
        context.fill();

        context.beginPath();
        context.lineTo(-0.5 * pixelRatio, rIn);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(-pad1, 0);
        context.lineTo(-pad2, -rOut);
        context.lineTo(pad2 / 2 * pixelRatio - 2 * pixelRatio, -rOut);
        context.closePath();
        context.fillStyle = options.colorNeedleShadowUp;
        context.fill();
    }

    else { // simple line needle
        context.beginPath();
        context.moveTo(-pad2, rIn);
        context.lineTo(-pad2, rStart);
        context.lineTo(pad2, rStart);
        context.lineTo(pad2, rIn);
        context.closePath();
        context.fill();
    }

    if (options.needleCircleSize) {
        drawings.drawNeedleShadow(context, options);

        if (options.needleCircleOuter) {
            context.beginPath();
            context.arc(0, 0, r1, 0, PI * 2, true);
            context.fillStyle = drawings.linearGradient(
                context,
                options.colorNeedleCircleOuter,
                options.colorNeedleCircleOuterEnd,
                r1
            );
            context.fill();
            context.closePath();
        }

        if (options.needleCircleInner) {
            context.beginPath();
            context.arc(0, 0, r2, 0, PI * 2, true);
            context.fillStyle = drawings.linearGradient(
                context,
                options.colorNeedleCircleInner,
                options.colorNeedleCircleInnerEnd,
                r2
            );
            context.fill();
            context.closePath();
        }

        context.restore();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge value box
 *
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 * @param {number} value
 */
function drawRadialValueBox(context, options, value) {
    drawings.drawValueBox(context, options, value, 0,
        context.max - context.max * .33, context.max);
}

/**
 * Minimalistic HTML5 Canvas Gauge
 * @example
 *  var gauge = new RadialGauge({
 *     renderTo: 'gauge-id', // identifier of HTML canvas element or element itself
 *     width: 400,
 *     height: 400,
 *     units: 'Km/h',
 *     title: false,
 *     value: 0,
 *     minValue: 0,
 *     maxValue: 220,
 *     majorTicks: [
 *         '0','20','40','60','80','100','120','140','160','180','200','220'
 *     ],
 *     minorTicks: 2,
 *     strokeTicks: false,
 *     highlights: [
 *         { from: 0, to: 50, color: 'rgba(0,255,0,.15)' },
 *         { from: 50, to: 100, color: 'rgba(255,255,0,.15)' },
 *         { from: 100, to: 150, color: 'rgba(255,30,0,.25)' },
 *         { from: 150, to: 200, color: 'rgba(255,0,225,.25)' },
 *         { from: 200, to: 220, color: 'rgba(0,0,255,.25)' }
 *     ],
 *     colorPlate: '#222',
 *     colorMajorTicks: '#f5f5f5',
 *     colorMinorTicks: '#ddd',
 *     colorTitle: '#fff',
 *     colorUnits: '#ccc',
 *     colorNumbers: '#eee',
 *     colorNeedleStart: 'rgba(240, 128, 128, 1)',
 *     colorNeedleEnd: 'rgba(255, 160, 122, .9)',
 *     valueBox: true,
 *     animationRule: 'bounce'
 * });
 * // draw initially
 * gauge.draw();
 * // animate
 * setInterval(() => {
 *    gauge.value = Math.random() * -220 + 220;
 * }, 1000);
 */
export default class RadialGauge extends BaseGauge {

    /**
     * @constructor
     * @param {RadialGaugeOptions} options
     */
    constructor(options) {
        options = Object.assign({}, defaultRadialGaugeOptions, options || {});

        /* istanbul ignore if */
        if (isNaN(options.startAngle)) options.startAngle = 45;
        /* istanbul ignore if */
        if (isNaN(options.ticksAngle)) options.ticksAngle = 270;

        /* istanbul ignore if */
        if (options.ticksAngle > 360) options.ticksAngle = 360;
        /* istanbul ignore if */
        if (options.ticksAngle < 0) options.ticksAngle = 0;

        /* istanbul ignore if */
        if (options.startAngle < 0) options.startAngle = 0;
        /* istanbul ignore if */
        if (options.startAngle > 360) options.startAngle = 360;

        super(options);
    }

    /*  */
    /**
     * Triggering gauge render on a canvas.
     *
     * @returns {RadialGauge}
     */
    draw() {
        let canvas = this.canvas;
        let [x, y, w, h] = [
            -canvas.drawX,
            -canvas.drawY,
            canvas.drawWidth,
            canvas.drawHeight
        ];
        let options = this.options;

        if (!canvas.elementClone.initialized) {
            let context = canvas.contextClone;

            // clear the cache
            context.clearRect(x, y, w, h);
            context.save();

            drawRadialPlate(context, options);
            drawRadialHighlights(context, options);
            drawRadialMinorTicks(context, options);
            drawRadialMajorTicks(context, options);
            drawRadialNumbers(context, options);
            drawRadialTitle(context, options);
            drawRadialUnits(context, options);

            canvas.elementClone.initialized = true;
        }

        this.canvas.commit();

        // clear the canvas
        canvas.context.clearRect(x, y, w, h);
        canvas.context.save();

        canvas.context.drawImage(canvas.elementClone, x, y, w, h);
        canvas.context.save();

        drawRadialValueBox(canvas.context, options, options.animatedValue ?
            this.options.value : this.value);
        drawRadialNeedle(canvas.context, options);

        return this;
    }
}


/**
 * @typedef {object} ns
 */
/* istanbul ignore if */
if (typeof ns !== 'undefined') {
    ns['RadialGauge'] = RadialGauge;
}

BaseGauge.initialize('RadialGauge', defaultRadialGaugeOptions);

module.exports = RadialGauge;
