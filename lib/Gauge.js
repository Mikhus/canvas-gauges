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
 *
 * @authors: Mykhailo Stadnyk <mikhus@gmail.com>
 *           Chris Poile <poile@edwards.usask.ca>
 *           Luca Invernizzi <http://www.lucainvernizzi.net>
 *           Rhys Lloyd <http://rhyslloyd.me>
 *           Robert Blackburn <http://www.rwblackburn.com>
 *           Charles Galpin <https://github.com/cgalpin>
 *           Luca Ghio <https://github.com/cassiodoroVicinetti>
 *           Greg <https://github.com/gregroper>
 *           David Esperalta <info@davidesperalta.com>
 *           Gwenaël (https://thegtricks.thegounet.fr)
 *           migeruhito (https://github.com/migeruhito)
 */
require('./polyfill');

const Animation = require('./Animation');
const SmartCanvas = require('./SmartCanvas');
const DomParser = require('./DomObserver');

// todo: customizable fonts
// todo: customizable plate border width
// todo: readme and documentation update
// todo: github pages
// todo: wiki
// todo: LinearGauge implementation
// todo: online configurator
// todo: online packager
// todo: optimizations and memory leaks resolving
// todo: better minification

/**
 * Describes rendering target element. Can be either string identifier of
 * the element or the element itself.
 *
 * @typedef {HTMLElement|string} RenderTarget
 */

/**
 * Highlight area definition.
 * It describes highlight area starting from value to value using
 * color. Color can be describes with hex, rgb or rgba value.
 *
 * @typedef {{ from: number, to: number, color: string}} Highlight
 */

/**
 *
 * Gauge configuration options
 *
 * @typedef {{renderTo: RenderTarget, width: number, height: number, title: string|boolean, maxValue: number, minValue: number, value: number, majorTicks: Array, minorTicks: number, ticksAngle: number, startAngle: number, strokeTicks: boolean, units: string|boolean, updateValueOnAnimation: boolean, glow: boolean, valueInt: number, valueDec: number, majorTicksInt: number, majorTicksDec: number, animation: boolean, animationDuration: number, animationRule: AnimationRule, colorPlate: string, colorMajorTicks: string, colorMinorTicks: string, colorTitle: string, colorUnits: string, colorNumbers: string, colorNeedleStart: string, colorNeedleEnd: string, colorNeedleCircleOuterStart: string, colorNeedleCircleOuterEnd: string, colorNeedleCircleInnerStart: string, colorNeedleCircleInnerEnd: string, colorNeedleShadowUp: string, colorNeedleShadowDown: string, colorValueBoxRectStart: string, colorValueBoxRectEnd: string, colorValueBoxBackground: string, colorValueBoxShadow: string, colorValueText: string, colorValueTextShadow: string, colorCircleShadow: string, colorCircleOuterStart: string, colorCircleOuterEnd: string, colorCircleMiddleStart: string, colorCircleMiddleEnd: string, colorCircleInnerStart: string, colorCircleInnerEnd: string, needle: boolean, needleShadow: boolean, needleType: string, needleStart: number, needleEnd: number, needleWidth: number, needleCircle: boolean, needleCircleSize: number, needleCircleInner: boolean, needleCircleOuter: boolean, circles: boolean, circleOuter: boolean, circleMiddle: boolean, circleInner: boolean, valueBox: boolean, valueText: boolean, highlights: Highlight[]}} GaugeOptions
 */

/**
 * @access private
 * @typedef {CanvasRenderingContext2D|{max:number}} Canvas2DContext
 */

//noinspection JSValidateTypes
/**
 * Default gauge configuration options
 *
 * @access private
 * @type {GaugeOptions}
 */
const defaultOptions = {
    renderTo: null,
    width: 200,
    height: 200,
    title: false,
    maxValue: 100,
    minValue: 0,
    value: 0,
    majorTicks: [],
    minorTicks: 10,
    ticksAngle: 270,
    startAngle: 45,
    strokeTicks: true,
    units: false,
    updateValueOnAnimation: false,
    glow: true,

    // number formats
    valueInt: 3,
    valueDec: 2,
    majorTicksInt: 1,
    majorTicksDec: 0,

    // animations
    animation: true,
    animationDuration: 250,
    animationRule: 'cycle',

    // colors
    colorPlate: '#fff',
    colorMajorTicks: '#444',
    colorMinorTicks: '#666',
    colorTitle: '#888',
    colorUnits: '#888',
    colorNumbers: '#444',
    colorNeedleStart: 'rgba(240,128,128,1)',
    colorNeedleEnd: 'rgba(255,160,122,.9)',
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
    colorValueText: '#444',
    colorValueTextShadow: 'rgba(0,0,0,0.3)',
    colorCircleShadow: 'rgba(0,0,0,0.5)',
    colorCircleOuterStart: '#ddd',
    colorCircleOuterEnd: '#aaa',
    colorCircleMiddleStart: '#eee',
    colorCircleMiddleEnd: '#f0f0f0',
    colorCircleInnerStart: '#fafafa',
    colorCircleInnerEnd: '#ccc',

    // needle
    needle: true,
    needleShadow: true,
    needleType: 'arrow',
    needleStart: 0,
    needleEnd: 77,
    needleWidth: 4,
    needleCircle: true,
    needleCircleSize: 10,
    needleCircleInner: true,
    needleCircleOuter: true,

    circles: true,
    circleOuter: true,
    circleMiddle: true,
    circleInner: true,
    valueBox: true,
    valueText: true,
    highlights: [
        { from: 20, to: 60, color: '#eee' },
        { from: 60, to: 80, color: '#ccc' },
        { from: 80, to: 100, color: '#999' }]
};

/**
 * Formats a number for display on the dial's plate using the majorTicksFormat
 * config option.
 *
 * @access private
 * @param {number} num number to format
 * @param {object} options
 * @returns {string} formatted number
 */
function formatMajorTickNumber(num, options) {
    let right, hasDec = false;

    // First, force the correct number of digits right of the decimal.
    if (options.majorTicksDec === 0) {
        right = Math.round(num).toString();
    }

    else {
        right = num.toFixed(options.majorTicksDec);
    }

    // Second, force the correct number of digits left of the decimal.
    if (options.majorTicksInt > 1) {
        // Does this number have a decimal?
        hasDec = ~right.indexOf('.');

        // Is this number a negative number?
        if (~right.indexOf('-')) {
            return '-' + [
                options.majorTicksInt +
                options.majorTicksDec +
                2 + (hasDec ? 1 : 0) - right.length
            ].join('0') + right.replace('-', '');
        }

        else {
            return [
                options.majorTicksInt +
                options.majorTicksDec +
                1 + (hasDec ? 1 : 0) - right.length
            ].join('0') + right;
        }
    }

    return right;
}

/**
 * Transforms degrees to radians
 *
 * @param {number} degrees
 * @returns {number}
 */
function radians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Calculates and returns radial point coordinates
 *
 * @access private
 * @param {number} radius
 * @param {number} angle
 * @returns {{x: number, y: number}}
 */
function radialPoint(radius, angle) {
    return { x: -radius * Math.sin(angle), y: radius * Math.cos(angle) };
}

/**
 * Creates and returns linear gradient canvas object
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {string} colorFrom
 * @param {string} colorTo
 * @param {number} length
 * @returns {CanvasGradient}
 */
function linearGradient(context, colorFrom, colorTo, length) {
    let grad = context.createLinearGradient(0, 0, 0, length);

    grad.addColorStop(0, colorFrom);
    grad.addColorStop(1, colorTo);

    return grad;
}

/**
 * Pads a given value with leading zeros using the given options
 *
 * @access private
 * @param {number} val
 * @param {{valueInt: number, valueDec: number}} options
 * @returns {string}
 */
function padValue(val, options) {
    let dec = options.valueDec;
    let int = options.valueInt;
    let i = 0;
    let s, strVal, n;

    val = parseFloat(val);
    n = (val < 0);
    val = Math.abs(val);

    if (dec > 0) {
        strVal = val.toFixed(dec).toString().split('.');
        s = int - strVal[0].length;

        for (; i < s; ++i) {
            strVal[0] = '0' + strVal[0];
        }

        strVal = (n ? '-' : '') + strVal[0] + '.' + strVal[1];
    }

    else {
        strVal = Math.round(val).toString();
        s = int - strVal.length;

        for (; i < s; ++i) {
            strVal = '0' + strVal;
        }

        strVal = (n ? '-' : '') + strVal;
    }

    return strVal;
}

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
    context.arc(0, 0, radius, 0, Math.PI * 2, true);
    context.fillStyle = linearGradient(context, start, end, radius);
    context.fill();
}

/**
 * Draws gauge plate on the canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawPlate(context, options) {
    let r0 = context.max / 100 * 93;
    let d0 = context.max - r0;
    let r1 = context.max / 100 * 91;
    let r2 = context.max / 100 * 88;
    let r3 = context.max / 100 * 85;

    context.save();

    if (options.glow) {
        context.shadowBlur = d0;
        context.shadowColor = options.colorCircleShadow;
    }

    if (options.circles) {
        if (options.circleOuter) {
            drawCircle(r0, context,
                options.colorCircleOuterStart,
                options.colorCircleOuterEnd);
        }

        context.restore();

        if (options.circleMiddle) {
            drawCircle(r1, context,
                options.colorCircleMiddleStart,
                options.colorCircleMiddleEnd);
        }

        if (options.circleInner) {
            drawCircle(r2, context,
                options.colorCircleInnerStart,
                options.colorCircleInnerEnd);
        }
    }

    context.beginPath();
    context.arc(0, 0, r3, 0, Math.PI * 2, true);
    context.fillStyle = options.colorPlate;
    context.fill();

    context.save();
}

/**
 * Draws gauge highlight areas on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawHighlights(context, options) {
    context.save();

    let r1 = context.max / 100 * 81;
    let r2 = r1 - context.max / 100 * 15;
    let i = 0, s = options.highlights.length;

    for (; i < s; i++) {
        let hlt = options.highlights[i];
        let vd = (options.maxValue - options.minValue) / options.ticksAngle;
        let sa = radians(options.startAngle +
                (hlt.from - options.minValue) / vd);
        let ea = radians(options.startAngle + (hlt.to - options.minValue) / vd);
        let ps = radialPoint(r2, sa);
        let pe = radialPoint(r1, sa);
        let ps1 = radialPoint(r1, ea);
        let pe1 = radialPoint(r2, ea);

        context.beginPath();
        context.rotate(radians(90));
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
        context.rotate(radians(90));
        context.arc(0, 0, r2, sa - 0.2, ea + 0.2, false);
        context.restore();

        context.closePath();

        context.fillStyle = options.colorPlate;
        context.fill();
        context.save();
    }
}

/**
 * Draws minor ticks bar on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawMinorTicks(context, options) {
    let radius = context.max / 100 * 81;

    context.lineWidth = SmartCanvas.pixelRatio;
    context.strokeStyle = options.colorMinorTicks;

    context.save();

    let s = options.minorTicks * (options.majorTicks.length - 1);
    let i = 0;

    for (; i < s; ++i) {
        let angle = options.startAngle + i * (options.ticksAngle / s);

        context.rotate(radians(angle));

        context.beginPath();
        context.moveTo(0, radius);
        context.lineTo(0, radius - context.max / 100 * 7.5);
        context.stroke();

        context.restore();
        context.save();
    }
}

/**
 * Draws gauge major ticks bar on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawMajorTicks(context, options) {
    let r = context.max / 100 * 81;
    let i = 0;
    let s = options.majorTicks.length;
    let pixelRatio = SmartCanvas.pixelRatio;

    context.lineWidth = 2 * pixelRatio;
    context.strokeStyle = options.colorMajorTicks;
    context.save();

    if (s === 0) {
        let numberOfDefaultTicks = 5;
        let tickSize = (options.maxValue - options.minValue) /
            numberOfDefaultTicks;

        for (; i < numberOfDefaultTicks; i++) {
            options.majorTicks.push(formatMajorTickNumber(
                options.minValue + (tickSize * i),
                options));
        }
        options.majorTicks.push(formatMajorTickNumber(
            options.maxValue,
            options));
    }

    i = 0;
    for (; i < s; ++i) {
        let a = options.startAngle + i * (options.ticksAngle / (s - 1));
        context.rotate(radians(a));

        context.beginPath();
        context.moveTo(0, r);
        context.lineTo(0, r - context.max / 100 * 15);
        context.stroke();

        context.restore();
        context.save();
    }

    if (options.strokeTicks) {
        context.rotate(radians(90));

        context.beginPath();
        context.arc(0, 0, r,
            radians(options.startAngle),
            radians(options.startAngle + options.ticksAngle),
            false
        );
        context.stroke();
        context.restore();

        context.save();
    }
}

/**
 * Draws gauge bar numbers
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawNumbers(context, options) {
    let radius = context.max / 100 * 55;
    let points = {};
    let i = 0;
    let s = options.majorTicks.length;

    for (; i < s; ++i) {
        let angle = options.startAngle + i * (options.ticksAngle / (s - 1));
        let point = radialPoint(radius, radians(angle));

        if (angle === 360) angle = 0;

        if (points[angle]) {
            continue; //already drawn at this place, skipping
        }

        points[angle] = true;

        context.font = 20 * (context.max / 200) + 'px Arial';
        context.fillStyle = options.colorNumbers;
        context.lineWidth = 0;
        context.textAlign = 'center';
        context.fillText(options.majorTicks[i], point.x, point.y + 3);
    }
}

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
    context.font = 24 * (context.max / 200) + 'px Arial';
    context.fillStyle = options.colorTitle;
    context.textAlign = 'center';
    context.fillText(options.title, 0, -context.max / 4.25);
    context.restore();
}

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
    context.font = 22 * (context.max / 200) + 'px Arial';
    context.fillStyle = options.colorUnits;
    context.textAlign = 'center';
    context.fillText(options.units, 0, context.max / 3.25);
    context.restore();
}

/**
 * Draws gauge needle shadow
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawNeedleShadow(context, options) {
    if (!options.needleShadow) return;

    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 10;
    context.shadowColor = options.colorNeedleShadowDown;
}

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
    let max = context.max;
    let r1 = max / 100 * options.needleCircleSize;
    let  r2 = max / 100 * options.needleCircleSize * 0.75;
    let rIn = max / 100 * options.needleEnd;
    let rStart = options.needleStart ?
        max / 100 * options.needleStart : 0,
        rOut = max / 100 * 20;
    let pad1 = max / 100 * options.needleWidth;
    let pad2 = max / 100 * options.needleWidth / 2;
    let pixelRatio = SmartCanvas.pixelRatio;

    drawNeedleShadow(context, options);

    context.save();

    context.rotate(radians(
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

        context.fillStyle = linearGradient(
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

        context.fillStyle = linearGradient(
            context,
            options.colorNeedleStart,
            options.colorNeedleEnd,
            rIn - rOut
        );
        context.fill();
    }

    context.restore();

    if (options.needleCircle) {
        drawNeedleShadow(context, options);

        if (options.needleCircleOuter) {
            context.beginPath();
            context.arc(0, 0, r1, 0, Math.PI * 2, true);
            context.fillStyle = linearGradient(
                context,
                options.colorNeedleCircleOuterStart,
                options.colorNeedleCircleOuterEnd,
                r1
            );
            context.fill();
            context.restore();
        }

        if (options.needleCircleInner) {
            context.beginPath();
            context.arc(0, 0, r2, 0, Math.PI * 2, true);
            context.fillStyle = linearGradient(
                context,
                options.colorNeedleCircleInnerStart,
                options.colorNeedleCircleInnerEnd,
                r2
            );
            context.fill();
        }
    }
}

/**
 * Draws rounded corners rectangle
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
function roundRect(context, x, y, w, h, r) {
    context.beginPath();

    context.moveTo(x + r, y);
    context.lineTo(x + w - r, y);

    context.quadraticCurveTo(x + w, y, x + w, y + r);
    context.lineTo(x + w, y + h - r);

    context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    context.lineTo(x + r, y + h);

    context.quadraticCurveTo(x, y + h, x, y + h - r);
    context.lineTo(x, y + r);

    context.quadraticCurveTo(x, y, x + r, y);

    context.closePath();
}

/**
 * Draws gauge value box
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 * @param {number} [value]
 */
function drawValueBox(context, options, value) {
    if (!options.valueText) return;

    if (typeof value === 'undefined') {
        value = options.value;
    }

    let max = context.max;
    let text = padValue(value, options);
    let y = max - max / 100 * 33;
    let x = 0;

    context.save();
    context.font = 40 * (max / 200) + 'px Led';
    context.save();

    if (options.valueBox) {
        let th = 0.12 * max;
        let tw = context.measureText('-' + padValue(0, options)).width;

        roundRect(context,
            -tw / 2 - 0.025 * max,
            y - th - 0.04 * max,
            tw + 0.05 * max,
            th + 0.07 * max,
            0.025 * max);
    }

    let grd = context.createRadialGradient(
        x,
        y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2,
        max / 10,
        x,
        y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2,
        max / 5
    );

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
 *     renderTo: 'gauge',
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
export default class Gauge {

    /**
     * @constructor
     * @param {GaugeOptions} options
     */
    constructor(options) {
        Gauge.Collection.push(this);

        options = Object.assign({}, defaultOptions, options || {});

        options.startAngle = parseInt(options.startAngle, 10);
        options.ticksAngle = parseInt(options.ticksAngle, 10);

        if (isNaN(options.startAngle)) options.startAngle = 45;
        if (isNaN(options.ticksAngle)) options.ticksAngle = 270;

        if (options.ticksAngle > 360) options.ticksAngle = 360;
        if (options.ticksAngle < 0) options.ticksAngle = 0;

        if (options.startAngle < 0) options.startAngle = 0;
        if (options.startAngle > 360) options.startAngle = 360;

        options.minValue = parseFloat(options.minValue);
        options.maxValue = parseFloat(options.maxValue);

        if (!(options.highlights instanceof Array)) {
            options.highlights = [];
        }

        if (!options.renderTo) {
            throw TypeError('Canvas element was not specified when creating ' +
                'the Gauge object!');
        }

        let canvas = options.renderTo.tagName ?
            options.renderTo :
            document.getElementById(options.renderTo);

        //noinspection JSUnresolvedVariable
        /**
         * @property {GaugeOptions} Gauge.options
         */
        this.options = options;

        /**
         * @property {SmartCanvas} Gauge.canvas
         */
        this.canvas = new SmartCanvas(canvas, options.width, options.height);
        this.canvas.onRedraw = this.draw.bind(this);

        /**
         * @property {Animation} Gauge.animation
         */
        this.animation = new Animation(
            options.animationRule,
            options.animationDuration);
    }

    /**
     * Sets new value for this gauge.
     * If gauge is animated by configuration it will trigger a proper animation.
     * Upsetting a value triggers gauge redraw.
     *
     * @param {number} value
     */
    set value(value) {
        if (value === this.options.value) return;

        if (this.options.animation) {
            let fromValue = this.options.value;

            this.animation.animate(percent => {
                let stepValue = fromValue + (value - fromValue) * percent;

                this.options.value = stepValue;
                this.draw(this.options.updateValueOnAnimation ?
                    stepValue : value);
            }, () => {
                this.options.value = value;
                this.draw();
            });
        }

        else {
            this.options.value = value;
            this.draw();
        }
    }

    /**
     * Returns current value of the gauge
     *
     * @return {number}
     */
    get value() {
        return this.options.value;
    }

    /**
     * Triggering gauge render on a canvas.
     *
     * @param {number} [value]
     * @returns {Gauge}
     */
    draw(value) {
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

        drawValueBox(canvas.context, options, value);
        drawNeedle(canvas.context, options);

        return this;
    }
}

Gauge.Collection = [];
Gauge.Collection.get = function (id) {
    if (typeof id === 'string') {
        let i = 0;
        let s = this.length;

        for (; i < s; i++) {
            let canvas = this[i].config.renderTo.tagName ?
                this[i].config.renderTo :
                document.getElementById(this[i].config.renderTo || '');

            if (canvas.getAttribute('id') === id) {
                return this[i];
            }
        }
    }

    else if (typeof id === 'number') {
        return this[id];
    }

    return null;
};

new DomParser(defaultOptions, 'canvas', 'gauge', Gauge);

module.exports = window['Gauge'] = Gauge;
