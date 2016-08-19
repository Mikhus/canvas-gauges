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
require('./babelHelpers');

const Animation = require('./Animation');
const SmartCanvas = require('./SmartCanvas');
const DomParser = require('./DomObserver');
const SharedOptions = require('./SharedOptions');

// todo: customizable fonts
// todo: readme and documentation update
// todo: github pages
// todo: wiki
// todo: LinearGauge implementation
// todo: online configurator
// todo: online packager
// todo: e2e tests
// todo: optimize build process (glue and minify without babel and browserify)
// todo: angular 2 integration
// todo: react integrations
// todo: typescript definitions

/**
 * Gauge configuration options
 *
 * @typedef {{renderTo: RenderTarget, width: number, height: number, title: string|boolean, maxValue: number, minValue: number, value: number, majorTicks: Array, minorTicks: number, ticksAngle: number, startAngle: number, strokeTicks: boolean, units: string|boolean, updateValueOnAnimation: boolean, glow: boolean, valueInt: number, valueDec: number, majorTicksInt: number, majorTicksDec: number, animation: boolean, animationDuration: number, animationRule: AnimationRule, colorPlate: string, colorMajorTicks: string, colorMinorTicks: string, colorTitle: string, colorUnits: string, colorNumbers: string, colorNeedleStart: string, colorNeedleEnd: string, colorNeedleCircleOuterStart: string, colorNeedleCircleOuterEnd: string, colorNeedleCircleInnerStart: string, colorNeedleCircleInnerEnd: string, colorNeedleShadowUp: string, colorNeedleShadowDown: string, colorValueBoxRectStart: string, colorValueBoxRectEnd: string, colorValueBoxBackground: string, colorValueBoxShadow: string, colorValueText: string, colorValueTextShadow: string, colorBorderShadow: string, colorBorderOuterStart: string, colorBorderOuterEnd: string, colorBorderMiddleStart: string, colorBorderMiddleEnd: string, colorBorderInnerStart: string, colorBorderInnerEnd: string, needle: boolean, needleShadow: boolean, needleType: string, needleStart: number, needleEnd: number, needleWidth: number, needleCircle: boolean, needleCircleSize: number, needleCircleInner: boolean, needleCircleOuter: boolean, borders: boolean, borderOuter: boolean, borderOuterWidth: number, borderMiddle: boolean, borderMiddleWidth: number, borderInner: boolean, borderInnerWidth: number, borderShadowWidth: number, valueBox: boolean, valueText: boolean, highlights: Highlight[]}} GaugeOptions
 */

/**
 * @access private
 * @typedef {CanvasRenderingContext2D|{max: number, maxRadius: number}} Canvas2DContext
 */

//noinspection JSValidateTypes
/**
 * Default gauge configuration options
 *
 * @access private
 * @type {GaugeOptions}
 */
const defaultOptions = Object.assign({}, SharedOptions, {
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
    needleStart: 0,
    needleEnd: 85,
    needleWidth: 4,
    needleCircle: true,
    needleCircleSize: 10,
    needleCircleInner: true,
    needleCircleOuter: true
});

/* istanbul ignore next: private, not testable */
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

/* istanbul ignore next: private, not testable */
/**
 * Transforms degrees to radians
 *
 * @param {number} degrees
 * @returns {number}
 */
function radians(degrees) {
    return degrees * Math.PI / 180;
}

/* istanbul ignore next: private, not testable */
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

/* istanbul ignore next: private, not testable */
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

/* istanbul ignore next: private, not testable */
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
    context.arc(0, 0, radius, 0, Math.PI * 2, true);
    context.fillStyle = linearGradient(context, start, end, radius);
    context.fill();
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

    if (options.borders) {
        if (options.borderOuter) {
            drawCircle(r0, context,
                options.colorBorderOuterStart,
                options.colorBorderOuterEnd);
        }

        context.restore();

        if (options.borderMiddle) {
            drawCircle(r1, context,
                options.colorBorderMiddleStart,
                options.colorBorderMiddleEnd);
        }

        if (options.borderInner) {
            drawCircle(r2, context,
                options.colorBorderInnerStart,
                options.colorBorderInnerEnd);
        }
    }

    context.beginPath();
    context.arc(0, 0, r3, 0, Math.PI * 2, true);
    context.fillStyle = options.colorPlate;
    context.fill();

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

        context.rotate(radians(angle));

        context.beginPath();
        context.moveTo(0, radius);
        context.lineTo(0, radius - context.max * .075);
        context.stroke();

        context.restore();
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
        context.lineTo(0, r - context.max * .15);
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
    context.font = 24 * (context.max / 200) + 'px Arial';
    context.fillStyle = options.colorTitle;
    context.textAlign = 'center';
    context.fillText(options.title, 0, -context.max / 4.25);
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
    context.font = 22 * (context.max / 200) + 'px Arial';
    context.fillStyle = options.colorUnits;
    context.textAlign = 'center';
    context.fillText(options.units, 0, context.max / 3.25);
    context.restore();
}

/* istanbul ignore next: private, not testable */
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

/* istanbul ignore next: private, not testable */
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
    let text = padValue(value, options);
    let y = max - max * .33;
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

        options.minValue = parseFloat(options.minValue);
        options.maxValue = parseFloat(options.maxValue);

        /* istanbul ignore if */
        if (!(options.highlights instanceof Array)) {
            options.highlights = [];
        }

        if (!options.renderTo) {
            throw TypeError('Canvas element was not specified when creating ' +
                'the Gauge object!');
        }

        let canvas = options.renderTo.tagName ?
            options.renderTo :
            /* istanbul ignore next: to be tested with e2e tests */
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

            /**
             * @type {number}
             * @access private
             */
            this._value = value;

            this.animation.animate(percent => {
                this.options.value = fromValue + (value - fromValue) * percent;

                this.draw();
            }, () => {
                this.options.value = value;
                delete this._value;
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
        return typeof this._value === 'undefined' ?
            this.options.value : this._value;
    }

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

    /**
     * Updates gauge configuration options at runtime and redraws the gauge
     *
     * @param {GaugeOptions} options
     * @returns {Gauge}
     */
    update(options) {
        Object.assign(this.options, options || {});

        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;

        this.animation.rule = this.options.animationRule;
        this.animation.duration = this.options.animationDuration;

        this.canvas.redraw();

        return this;
    }

    /**
     * Performs destruction of this object properly
     */
    destroy() {
        let index = Gauge.Collection.indexOf(this);

        /* istanbul ignore else */
        if (~index) {
            Gauge.Collection.splice(index, 1);
        }

        this.canvas.destroy();
        this.canvas = null;

        this.animation.destroy();
        this.animation = null;
    }
}

Gauge.Collection = [];
Gauge.Collection.get = function (id) {
    if (typeof id === 'string') {
        let i = 0;
        let s = this.length;

        for (; i < s; i++) {
            let canvas = this[i].options.renderTo.tagName ?
                this[i].options.renderTo :
                /* istanbul ignore next: should be tested with e2e tests */
                document.getElementById(this[i].options.renderTo || '');

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
