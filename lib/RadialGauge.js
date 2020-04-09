/*!
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Mykhailo Stadnyk <mikhus@gmail.com>
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
 * @typedef {GenericOptions | {
 *   exactTicks: boolean,
 *   ticksAngle: number,
 *   startAngle: number,
 *   colorNeedleCircleOuter: string,
 *   colorNeedleCircleOuterEnd: string,
 *   colorNeedleCircleInner: string,
 *   colorNeedleCircleInnerEnd: string,
 *   needleCircleSize: number,
 *   needleCircleInner: boolean,
 *   needleCircleOuter: boolean,
 *   animationTarget: string,
 *   useMinPath: boolean,
 *   barStartPosition: 'right' | 'left',
 * }} RadialGaugeOptions
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
    needleCircleOuter: true,
    needleStart: 20,

    // custom animations
    animationTarget: 'needle', // 'needle' or 'plate'
    useMinPath: false,

    barWidth: 0,
    barStartPosition: 'left'
});

/* istanbul ignore next: private, not testable */
/**
 * Draws gradient-filled circle on a canvas
 *
 * @access private
 * @param {number} radius
 * @param {number} width
 * @param {Canvas2DContext} context
 * @param {string} start gradient start color
 * @param {string} end gradient end color
 */
function drawRadialBorder(radius, width, context, start, end) {
    context.beginPath();
    //noinspection JSUnresolvedFunction
    context.arc(0, 0, abs(radius), 0, PI * 2, true);
    context.lineWidth = width;
    context.strokeStyle = end ?
        drawings.linearGradient(context, start, end, radius) :
        start;
    context.stroke();
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
    let pxRatio = SmartCanvas.pixelRatio;

    if (!context.maxRadius) {
        context.maxRadius = context.max
            - options.borderShadowWidth
            - options.borderOuterWidth * pxRatio
            - options.borderMiddleWidth * pxRatio
            - options.borderInnerWidth * pxRatio
            + (options.borderOuterWidth ? 0.5 : 0)
            + (options.borderMiddleWidth ? 0.5 : 0)
            + (options.borderInnerWidth ? 0.5 : 0);
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
    let pxRatio = SmartCanvas.pixelRatio;
    let d0 = options.borderShadowWidth * pxRatio;
    let r0 = context.max - d0 - (options.borderOuterWidth * pxRatio) / 2;
    let r1 = r0 - (options.borderOuterWidth * pxRatio) / 2 -
        (options.borderMiddleWidth * pxRatio) / 2 + 0.5;
    let r2 = r1 - (options.borderMiddleWidth * pxRatio) / 2 -
        (options.borderInnerWidth * pxRatio) / 2 + 0.5;
    let r3 = maxRadialRadius(context, options);
    let grad;
    let shadowDrawn = false;

    context.save();

    if (options.borderOuterWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawRadialBorder(r0,
            options.borderOuterWidth * pxRatio,
            context,
            options.colorBorderOuter,
            options.colorBorderOuterEnd);
    }

    if (options.borderMiddleWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawRadialBorder(r1,
            options.borderMiddleWidth * pxRatio,
            context,
            options.colorBorderMiddle,
            options.colorBorderMiddleEnd);
    }

    if (options.borderInnerWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawRadialBorder(r2,
            options.borderInnerWidth * pxRatio,
            context,
            options.colorBorderInner,
            options.colorBorderInnerEnd);
    }

    drawings.drawShadow(context, options, shadowDrawn);

    context.beginPath();
    //noinspection JSUnresolvedFunction
    context.arc(0, 0, abs(r3), 0, PI * 2, true);

    if (options.colorPlateEnd) {
        grad = context.createRadialGradient(0, 0, r3 / 2, 0, 0, r3);
        grad.addColorStop(0, options.colorPlate);
        grad.addColorStop(1, options.colorPlateEnd);
    }

    else  {
        grad = options.colorPlate;
    }

    context.fillStyle = grad;

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
function drawRadialHighlights(
    context,
    options
) {
    let hlWidth = context.max *
        (parseFloat(options.highlightsWidth) || 0) / 100;

    if (!hlWidth) return;

    //noinspection JSUnresolvedFunction
    let r = abs(radialTicksRadius(context, options) - hlWidth / 2);
    let i = 0, s = options.highlights.length;
    let vd = (options.maxValue - options.minValue) / options.ticksAngle;

    context.save();

    for (; i < s; i++) {
        let hlt = options.highlights[i];

        context.beginPath();

        context.rotate(HPI);
        context.arc(0, 0, r,
            drawings.radians(options.startAngle +
                (hlt.from - options.minValue) / vd),
            drawings.radians(options.startAngle +
                (hlt.to - options.minValue) / vd),
            false
        );
        context.strokeStyle = hlt.color;
        context.lineWidth = hlWidth;
        context.lineCap = options.highlightsLineCap;
        context.stroke();
        context.closePath();

        context.restore();
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
    let s, range, angle;
    let i = 0;
    let delta = 0;
    let minTicks = Math.abs(options.minorTicks) || 0;
    let ratio = options.ticksAngle / (options.maxValue - options.minValue);

    context.lineWidth = SmartCanvas.pixelRatio;
    context.strokeStyle = options.colorMinorTicks || options.colorStrokeTicks;

    context.save();

    if (options.exactTicks) {
        range = options.maxValue - options.minValue;
        s = minTicks ? range / minTicks : 0;
        delta = (BaseGauge.mod(options.majorTicks[0], minTicks) || 0)  * ratio;
    }

    else {
        s = minTicks * (options.majorTicks.length - 1);
    }

    for (; i < s; ++i) {
        angle = options.startAngle + delta + i * (options.ticksAngle / s);
        if (angle <= (options.ticksAngle + options.startAngle )) {
            context.rotate(drawings.radians(angle));

            context.beginPath();
            context.moveTo(0, radius);
            context.lineTo(0, radius - context.max * 0.075);
            closeStrokedPath(context);
        }
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
    let unit = context.max / 100;

    return maxRadialRadius(context, options) - 5 * unit -
        (options.barWidth ?
            ((parseFloat(options.barStrokeWidth) || 0) * 2 +
            ((parseFloat(options.barWidth) || 0) + 5) * unit) :
        0);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge major ticks bar on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialMajorTicks(context, options) {
    drawings.prepareTicks(options);

    //noinspection JSUnresolvedFunction
    let r = abs(radialTicksRadius(context, options));
    let i, colors;
    let s = options.majorTicks.length;
    let pixelRatio = SmartCanvas.pixelRatio;

    context.lineWidth = 2 * pixelRatio;
    context.save();

    colors = options.colorMajorTicks instanceof Array ?
        options.colorMajorTicks : new Array(s).fill(options.colorStrokeTicks ||
            options.colorMajorTicks);

    i = 0;
    for (; i < s; ++i) {
        context.strokeStyle = colors[i];
        context.rotate(drawings.radians(radialNextAngle(
            options,
            options.exactTicks ? options.majorTicks[i] : i,
            s
        )));

        context.beginPath();
        context.moveTo(0, r);
        context.lineTo(0, r - context.max * 0.15);
        closeStrokedPath(context);
    }

    if (options.strokeTicks) {
        context.strokeStyle = options.colorStrokeTicks || colors[0];
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
    if (options.exactTicks) {
        let ratio = options.ticksAngle / (options.maxValue - options.minValue);
        return options.startAngle + ratio * (i - options.minValue);
    }

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
    let radius = radialTicksRadius(context, options) - context.max * 0.15;
    let points = {};
    let i = 0;
    let s = options.majorTicks.length;
    let isAnimated = options.animationTarget !== 'needle';
    let colors = options.colorNumbers instanceof Array ?
        options.colorNumbers : new Array(s).fill(options.colorNumbers);

    let plateValueAngle = isAnimated ? -(options.value - options.minValue) /
        (options.maxValue - options.minValue) * options.ticksAngle : 0;

    if (isAnimated) {
        context.save();
        context.rotate(-drawings.radians(plateValueAngle));
    }

    context.font = drawings.font(options, 'Numbers', context.max / 200);
    context.lineWidth = 0;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (; i < s; ++i) {
        let angle = plateValueAngle + radialNextAngle(options,
            options.exactTicks ? options.majorTicks[i] : i, s);
        let textWidth = context.measureText(options.majorTicks[i]).width;
        let textHeight = options.fontNumbersSize;
        let textRadius = Math.sqrt(textWidth * textWidth +
            textHeight * textHeight) / 2;
        let point = drawings.radialPoint(radius - textRadius -
            options.numbersMargin / 100 * context.max,
            drawings.radians(angle));

        if (angle === 360) angle = 0;

        if (points[angle]) {
            continue; //already drawn at this place, skipping
        }

        points[angle] = true;

        context.fillStyle = colors[i];
        context.fillText(options.majorTicks[i], point.x, point.y);
    }

    isAnimated && context.restore();
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
    context.font = drawings.font(options, 'Title', context.max / 200);
    context.fillStyle = options.colorTitle;
    context.textAlign = 'center';
    context.fillText(options.title, 0, -context.max / 4.25, context.max * 0.8);
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
    context.font = drawings.font(options, 'Units', context.max / 200);
    context.fillStyle = options.colorUnits;
    context.textAlign = 'center';
    context.fillText(
        drawings.formatContext(options, options.units),
        0,
        context.max / 3.25,
        context.max * 0.8);
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

    let value = options.ticksAngle < 360 ?
        drawings.normalizedValue(options).indented : options.value;
        let startAngle = isFixed ? options.startAngle :
        (options.startAngle + (value - options.minValue) /
            (options.maxValue - options.minValue) * options.ticksAngle);
    if (options.barStartPosition === 'right') {
        startAngle = options.startAngle + options.ticksAngle -
            (value - options.minValue) / (options.maxValue - options.minValue) *
                options.ticksAngle;
    }
    let max = maxRadialRadius(context, options);
    //noinspection JSUnresolvedFunction
    let r1 = abs(max / 100 * options.needleCircleSize);
    //noinspection JSUnresolvedFunction
    let r2 = abs(max / 100 * options.needleCircleSize * 0.75);
    //noinspection JSUnresolvedFunction
    let rIn = abs(max / 100 * options.needleEnd);
    //noinspection JSUnresolvedFunction
    let rStart = abs(options.needleStart ?
            max / 100 * options.needleStart : 0);
    //noinspection JSUnresolvedFunction
    let pad1 = max / 100 * options.needleWidth;
    let pad2 = max / 100 * options.needleWidth / 2;
    let pixelRatio = SmartCanvas.pixelRatio;
    let isFixed = options.animationTarget !== 'needle';

    context.save();

    drawings.drawNeedleShadow(context, options);

    context.rotate(drawings.radians(startAngle));

    context.fillStyle = drawings.linearGradient(
        context,
        options.colorNeedle,
        options.colorNeedleEnd,
        rIn - rStart);

    if (options.needleType === 'arrow') {
        context.beginPath();
        context.moveTo(-pad2, -rStart);
        context.lineTo(-pad1, 0);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(pixelRatio, rIn);
        context.lineTo(pad1, 0);
        context.lineTo(pad2, -rStart);
        context.closePath();
        context.fill();

        context.beginPath();
        context.lineTo(-0.5 * pixelRatio, rIn);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(-pad1, 0);
        context.lineTo(-pad2, -rStart);
        context.lineTo(pad2 / 2 * pixelRatio - 2 * pixelRatio, -rStart);
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
        context.restore();

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
function drawRadialValueBox(
    context,
    options,
    value
) {
    drawings.drawValueBox(context, options, value, 0,
        context.max - context.max * 0.33, context.max);
}

/* istanbul ignore next: private, not testable */
/**
 * Computes start and end angle depending on barStartPositionOption
 *
 * @param {RadialGaugeOptions} options
 */
function computeAngles(options) {
    let sa = options.startAngle;
    let ea = options.startAngle + options.ticksAngle;
    let startAngle = sa;
    let endAngle = sa +
        (drawings.normalizedValue(options).normal -
            options.minValue) / (options.maxValue - options.minValue) *
        options.ticksAngle;
    if (options.barStartPosition === 'middle') {
        let midValue = (options.minValue + options.maxValue) * 0.5;
        if (options.value < midValue) {
            startAngle = 180 - ((
                (midValue - drawings.normalizedValue(options).normal) /
                (options.maxValue - options.minValue) *
                options.ticksAngle
            ));
            endAngle = 180;
        } else {
            startAngle = 180;
            endAngle = 180 + ((
                (drawings.normalizedValue(options).normal - midValue) /
                (options.maxValue - options.minValue) *
                options.ticksAngle));
        }
    } else if (options.barStartPosition === 'right') {
        startAngle = ea - endAngle + sa;
        endAngle = ea;
    }
    return {startAngle, endAngle};
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge progress bar
 *
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
function drawRadialProgressBar(context, options) {
    let unit = context.max / 100;
    let rMax = maxRadialRadius(context, options) - 5 * unit;
    let sw = (parseFloat(options.barStrokeWidth + '') || 0);
    let w = (parseFloat(options.barWidth + '') || 0) * unit;
    let rMin = rMax - sw * 2 - w;
    let half = (rMax- rMin) / 2;
    let r = rMin + half;
    let delta = sw / r;
    let sa = options.startAngle;
    let ea = options.startAngle + options.ticksAngle;

    context.save();
    context.rotate(HPI);

    if (sw) {
        // draw stroke
        context.beginPath();
        context.arc(0, 0, r, drawings.radians(sa) - delta,
            drawings.radians(ea) + delta, false);
        context.strokeStyle = options.colorBarStroke;
        context.lineWidth = half * 2;
        context.stroke();
        context.closePath();
    }

    if (w) {
        // draw bar
        context.beginPath();
        context.arc(0, 0, r, drawings.radians(sa), drawings.radians(ea), false);
        context.strokeStyle = options.colorBar;
        context.lineWidth = w;
        context.stroke();
        context.closePath();

        if  (options.barShadow) {
            // draw shadow
            context.beginPath();
            context.arc(0, 0, rMax, drawings.radians(sa), drawings.radians(ea),
                false);
            context.clip();

            context.beginPath();
            context.strokeStyle = options.colorBar;
            context.lineWidth = 1;
            context.shadowBlur = options.barShadow;
            context.shadowColor = options.colorBarShadow;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.arc(0, 0, rMax,
                drawings.radians(options.startAngle),
                drawings.radians(options.startAngle + options.ticksAngle),
                false);
            context.stroke();
            context.closePath();

            context.restore();
            context.rotate(HPI);
        }

        // draw bar progress
        if (options.barProgress) {
            let angles = computeAngles(options);
            let startAngle = angles.startAngle;
            let endAngle = angles.endAngle;

            context.beginPath();
            context.arc(0, 0, r,
                drawings.radians(startAngle),
                drawings.radians(endAngle),
                false);
            context.strokeStyle = options.colorBarProgress;
            context.lineWidth = w;
            context.stroke();
            context.closePath();
        }
    }

    context.restore();
}

/**
 * Find and return gauge value to display
 *
 * @param {RadialGauge} gauge
 */
function displayValue(gauge) {
    if (gauge.options.animatedValue) {
        return gauge.options.value;
    }

    return gauge.value;
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
     * Fired each time before gauge plate is drawn
     *
     * @event RadialGauge#beforePlate
     */

    /**
     * Fired each time before gauge highlight areas are drawn
     *
     * @event RadialGauge#beforeHighlights
     */

    /**
     * Fired each time before gauge minor ticks are drawn
     *
     * @event RadialGauge#beforeMinorTicks
     */

    /**
     * Fired each time before gauge major ticks are drawn
     *
     * @event RadialGauge#beforeMajorTicks
     */

    /**
     * Fired each time before gauge tick numbers are drawn
     *
     * @event RadialGauge#beforeNumbers
     */

    /**
     * Fired each time before gauge title is drawn
     *
     * @event RadialGauge#beforeTitle
     */

    /**
     * Fired each time before gauge units text is drawn
     *
     * @event RadialGauge#beforeUnits
     */

    /**
     * Fired each time before gauge progress bar is drawn
     *
     * @event RadialGauge#beforeProgressBar
     */

    /**
     * Fired each time before gauge value box is drawn
     *
     * @event RadialGauge#beforeValueBox
     */

    /**
     * Fired each time before gauge needle is drawn
     *
     * @event RadialGauge#beforeNeedle
     */

    /**
     * @constructor
     * @param {RadialGaugeOptions} options
     */
    constructor(options) {
        options = Object.assign({}, defaultRadialGaugeOptions, options || {});
        super(RadialGauge.configure(options));
    }

    /**
     * Checks and updates gauge options properly
     *
     * @param {*} options
     * @return {*}
     * @access protected
     */
    static configure(options) {
        if (options.barWidth > 50) options.barWidth = 50;

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

        return options;
    }

    /**
     * Sets the value for radial gauge
     *
     * @param {number} value
     */
    set value(value) {
        value = BaseGauge.ensureValue(value, this.options.minValue);

        if (this.options.animation &&
            this.options.ticksAngle === 360 &&
            this.options.useMinPath
        ) {
            this._value = value;
            value = this.options.value +
                ((((value - this.options.value) % 360) + 540) % 360) - 180;
        }

        super.value = value;
    }

    /**
     * Returns current gauge value
     *
     * @return {number}
     */
    get value() {
        return super.value;
    }

    /**
     * Triggering gauge render on a canvas.
     *
     * @returns {RadialGauge}
     */
    draw() {
        try {
            let canvas = this.canvas;
            let [x, y, w, h] = [
                -canvas.drawX,
                -canvas.drawY,
                canvas.drawWidth,
                canvas.drawHeight
            ];
            let options = this.options;

            if (options.animationTarget === 'needle') {
                if (!canvas.elementClone.initialized) {
                    let context = canvas.contextClone;

                    // clear the cache
                    context.clearRect(x, y, w, h);
                    context.save();

                    this.emit('beforePlate');
                    drawRadialPlate(context, options);
                    this.emit('beforeHighlights');
                    drawRadialHighlights(context, options);
                    this.emit('beforeMinorTicks');
                    drawRadialMinorTicks(context, options);
                    this.emit('beforeMajorTicks');
                    drawRadialMajorTicks(context, options);
                    this.emit('beforeNumbers');
                    drawRadialNumbers(context, options);
                    this.emit('beforeTitle');
                    drawRadialTitle(context, options);
                    this.emit('beforeUnits');
                    drawRadialUnits(context, options);

                    canvas.elementClone.initialized = true;
                }

                this.canvas.commit();

                // clear the canvas
                canvas.context.clearRect(x, y, w, h);
                canvas.context.save();

                canvas.context.drawImage(canvas.elementClone, x, y, w, h);
                canvas.context.save();

                this.emit('beforeProgressBar');
                drawRadialProgressBar(canvas.context, options);
                this.emit('beforeValueBox');
                drawRadialValueBox(canvas.context, options, displayValue(this));
                this.emit('beforeNeedle');
                drawRadialNeedle(canvas.context, options);
            }

            else {
                let plateValueAngle = -drawings.radians(
                    (options.value - options.minValue) /
                    (options.maxValue - options.minValue) *
                    options.ticksAngle);

                // clear the canvas
                canvas.context.clearRect(x, y, w, h);
                canvas.context.save();

                this.emit('beforePlate');
                drawRadialPlate(canvas.context, options);

                canvas.context.rotate(plateValueAngle);

                // animated
                this.emit('beforeHighlights');
                drawRadialHighlights(canvas.context, options);
                this.emit('beforeMinorTicks');
                drawRadialMinorTicks(canvas.context, options);
                this.emit('beforeMajorTicks');
                drawRadialMajorTicks(canvas.context, options);
                this.emit('beforeNumbers');
                drawRadialNumbers(canvas.context, options);
                this.emit('beforeProgressBar');
                drawRadialProgressBar(canvas.context, options);

                // non-animated
                canvas.context.rotate(-plateValueAngle);
                canvas.context.save();

                if (!canvas.elementClone.initialized) {
                    let context = canvas.contextClone;

                    // clear the cache
                    context.clearRect(x, y, w, h);
                    context.save();

                    this.emit('beforeTitle');
                    drawRadialTitle(context, options);
                    this.emit('beforeUnits');
                    drawRadialUnits(context, options);
                    this.emit('beforeNeedle');
                    drawRadialNeedle(context, options);

                    canvas.elementClone.initialized = true;
                }

                canvas.context.drawImage(canvas.elementClone, x, y, w, h);
            }

            // value box animations
            this.emit('beforeValueBox');
            drawRadialValueBox(canvas.context, options, displayValue(this));

            super.draw();
        }

        catch (err) {
           drawings.verifyError(err);
        }

        return this;
    }
}


/**
 * @ignore
 * @typedef {object} ns
 */
/* istanbul ignore if */
if (typeof ns !== 'undefined') {
    ns['RadialGauge'] = RadialGauge;
}

BaseGauge.initialize('RadialGauge', defaultRadialGaugeOptions);

module.exports = RadialGauge;
