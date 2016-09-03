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
 * @typedef {GenericOptions|{ticksAngle: number, startAngle: number, colorNeedleCircleOuterStart: string, colorNeedleCircleOuterEnd: string, colorNeedleCircleInnerStart: string, colorNeedleCircleInnerEnd: string, colorNeedleShadowUp: string, colorNeedleShadowDown: string, colorValueBoxRectStart: string, colorValueBoxRectEnd: string, colorValueBoxBackground: string, colorValueBoxShadow: string, needleStart: number, needleEnd: number, needleWidth: number, needleCircleSize: number, needleCircleInner: boolean, needleCircleOuter: boolean}} GaugeOptions
 */

/**
 * Default gauge configuration options
 *
 * @access private
 * @type {GaugeOptions}
 */
const defaultGaugeOptions = Object.assign({}, GenericOptions, {
    // basic options
    ticksAngle: 270,
    startAngle: 45,

    // colors
    colorNeedleCircleOuterStart: '#f0f0f0',
    colorNeedleCircleOuterEnd: '#ccc',
    colorNeedleCircleInnerStart: '#e8e8e8',
    colorNeedleCircleInnerEnd: '#f5f5f5',
    colorNeedleShadowUp: 'rgba(2,255,255,0.2)',
    colorNeedleShadowDown: 'rgba(188,143,143,0.45)',
    colorValueBoxRectStart: '#888',
    colorValueBoxRectEnd: '#666',
    colorValueBoxBackground: '#babab2',
    colorValueBoxShadow: 'rgba(0,0,0,1)',

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
function drawCircle(radius, context, start, end) {
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
 * @param {GaugeOptions} options
 * @return {number}
 */
function maxRadius(context, options) {
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
 * @param {GaugeOptions} options
 */
function drawPlate(context, options) {
    let d0 = options.borderShadowWidth;
    let r0 = context.max -  options.borderShadowWidth;
    let r1 = r0 - options.borderOuterWidth;
    let r2 = r1 - options.borderMiddleWidth;
    let r3 = maxRadius(context, options);

    context.save();

    if (options.glow) {
        context.shadowBlur = d0;
        context.shadowColor = options.colorBorderShadow;
    }

    if (options.borderOuterWidth) {
        drawCircle(r0, context,
            options.colorBorderOuterStart,
            options.colorBorderOuterEnd);
    }

    if (options.borderMiddleWidth) {
        drawCircle(r1, context,
            options.colorBorderMiddleStart,
            options.colorBorderMiddleEnd);
    }

    if (options.borderInnerWidth) {
        drawCircle(r2, context,
            options.colorBorderInnerStart,
            options.colorBorderInnerEnd);
    }

    context.restore();

    context.beginPath();
    context.arc(0, 0, r3, 0, PI * 2, true);
    context.fillStyle = options.colorPlate;
    context.fill();
    context.closePath();

    context.save();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge highlight areas on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawHighlights(context, options) {
    context.save();

    let r1 = maxRadius(context, options) - context.max * .05;
    let r2 = r1 - context.max * .15;
    let i = 0, s = options.highlights.length;

    for (; i < s; i++) {
        let hlt = options.highlights[i];
        let vd = (options.maxValue - options.minValue) / options.ticksAngle;
        let sa = drawings.radians(options.startAngle +
                (hlt.from - options.minValue) / vd);
        let ea = drawings.radians(options.startAngle + (hlt.to - options.minValue) / vd);
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
 * @param {GaugeOptions} options
 */
function drawMinorTicks(context, options) {
    let radius = maxRadius(context, options) - context.max * .05;

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
        context.stroke();
        context.restore();
        context.closePath();

        context.save();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge major ticks bar on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawMajorTicks(context, options) {
    let r = maxRadius(context, options) - context.max * .05;
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
        let a = options.startAngle + i * (options.ticksAngle / (s - 1));
        context.rotate(drawings.radians(a));

        context.beginPath();
        context.moveTo(0, r);
        context.lineTo(0, r - context.max * .15);
        context.stroke();

        context.restore();
        context.closePath();
        context.save();
    }

    if (options.strokeTicks) {
        context.rotate(HPI);

        context.beginPath();
        context.arc(0, 0, r,
            drawings.radians(options.startAngle),
            drawings.radians(options.startAngle + options.ticksAngle),
            false
        );
        context.stroke();
        context.restore();
        context.closePath();

        context.save();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge bar numbers
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawNumbers(context, options) {
    let radius = maxRadius(context, options) - context.max * .35;
    let points = {};
    let i = 0;
    let s = options.majorTicks.length;

    for (; i < s; ++i) {
        let angle = options.startAngle + i * (options.ticksAngle / (s - 1));
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
 * @param {GaugeOptions} options
 */
function drawTitle(context, options) {
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
 * @param {GaugeOptions} options
 */
function drawUnits(context, options) {
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
 * @param {GaugeOptions} options
 */
function drawNeedle(context, options) {
    if (!options.needle) return;

    let value = options.value;
    let max = maxRadius(context, options);
    let r1 = max / 100 * options.needleCircleSize;
    let r2 = max / 100 * options.needleCircleSize * 0.75;
    let rIn = max / 100 * options.needleEnd;
    let rStart = options.needleStart ?
            max / 100 * options.needleStart : 0,
            rOut = max * .2;
    let pad1 = max / 100 * options.needleWidth;
    let pad2 = max / 100 * options.needleWidth / 2;
    let pixelRatio = SmartCanvas.pixelRatio;

    drawings.drawNeedleShadow(context, options);

    context.save();

    context.rotate(drawings.radians(
        options.startAngle + (value - options.minValue) /
        (options.maxValue - options.minValue) * options.ticksAngle));

    if (options.needleType === 'arrow') {
        context.beginPath();
        context.moveTo(-pad2, -rOut);
        context.lineTo(-pad1, 0);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(pixelRatio, rIn);
        context.lineTo(pad1, 0);
        context.lineTo(pad2, -rOut);
        context.closePath();

        context.fillStyle = drawings.linearGradient(
            context,
            options.colorNeedleStart,
            options.colorNeedleEnd,
            rIn - rOut);
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

        context.fillStyle = drawings.linearGradient(
            context,
            options.colorNeedleStart,
            options.colorNeedleEnd,
            rIn - rOut
        );
        context.fill();
    }

    context.restore();

    if (options.needleCircleSize) {
        drawings.drawNeedleShadow(context, options);

        if (options.needleCircleOuter) {
            context.beginPath();
            context.arc(0, 0, r1, 0, PI * 2, true);
            context.fillStyle = drawings.linearGradient(
                context,
                options.colorNeedleCircleOuterStart,
                options.colorNeedleCircleOuterEnd,
                r1
            );
            context.fill();
            context.restore();
            context.closePath();
        }

        if (options.needleCircleInner) {
            context.beginPath();
            context.arc(0, 0, r2, 0, PI * 2, true);
            context.fillStyle = drawings.linearGradient(
                context,
                options.colorNeedleCircleInnerStart,
                options.colorNeedleCircleInnerEnd,
                r2
            );
            context.fill();
            context.closePath();
        }
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge value box
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 * @param {number} value
 */
function drawValueBox(context, options, value) {
    if (!options.valueText) return;

    let max = context.max;
    let text = drawings.padValue(value, options);
    let y = max - max * .33;
    let x = 0;

    context.save();
    context.font = 40 * (max / 200) + 'px ' + options.fontValue;
    context.save();

    if (options.valueBox) {
        let th = 0.12 * max;
        let tw = context.measureText('-' + drawings.padValue(0, options)).width;

        drawings.roundRect(context,
            -tw / 2 - 0.025 * max,
            y - th - 0.04 * max,
            tw + 0.05 * max,
            th + 0.07 * max,
            0.025 * max);
    }

    let gy = y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2;
    let grd = context.createRadialGradient(x, gy, max / 10, x, gy, max / 5);

    grd.addColorStop(0, options.colorValueBoxRectStart);
    grd.addColorStop(1, options.colorValueBoxRectEnd);

    context.strokeStyle = grd;
    context.lineWidth = 0.05 * max;
    context.stroke();

    context.shadowBlur = 0.012 * max;
    context.shadowColor = options.colorValueBoxShadow;

    context.fillStyle = options.colorValueBoxBackground;
    context.fill();

    context.restore();

    context.shadowOffsetX = 0.004 * max;
    context.shadowOffsetY = 0.004 * max;
    context.shadowBlur = 0.012 * max;
    context.shadowColor = options.colorValueTextShadow;

    context.fillStyle = options.colorValueText;
    context.textAlign = 'center';
    context.fillText(text, -x, y);

    context.restore();
}

/**
 * Minimalistic HTML5 Canvas Gauge
 * @example
 *  var gauge = new Gauge({
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
export default class Gauge extends BaseGauge {

    /**
     * @constructor
     * @param {GaugeOptions} options
     */
    constructor(options) {
        options = Object.assign({}, defaultGaugeOptions, options || {});

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
     * @returns {Gauge}
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

            drawPlate(context, options);
            drawHighlights(context, options);
            drawMinorTicks(context, options);
            drawMajorTicks(context, options);
            drawNumbers(context, options);
            drawTitle(context, options);
            drawUnits(context, options);

            canvas.elementClone.initialized = true;
        }

        this.canvas.commit();

        // clear the canvas
        canvas.context.clearRect(x, y, w, h);
        canvas.context.save();

        canvas.context.drawImage(canvas.elementClone, x, y, w, h);
        canvas.context.save();

        drawValueBox(canvas.context, options, this.value);
        drawNeedle(canvas.context, options);

        return this;
    }
}

window['Gauge'] = Gauge;

BaseGauge.initialize('Gauge', defaultGaugeOptions);

module.exports = Gauge;
