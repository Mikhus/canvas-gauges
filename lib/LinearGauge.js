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

const BaseGauge = require('./BaseGauge');
const GenericOptions = require('./GenericOptions');
const drawings = require('./drawings');

/**
 * Linear gauge configuration options
 *
 * @typedef {GenericOptions|{orientation: string, borderRadius: number, barBeginCircle: number, barWidth: number, barStrokeWidth: number, colorBar: string, colorBarEnd: string, colorBarStroke: string}} LinearGaugeOptions
 */

/**
 * Default linear gauge configuration options
 *
 * @type {LinearGaugeOptions}
 */
let defaultLinearGaugeOptions = Object.assign({}, GenericOptions, {
    // basic options
    borderRadius: 0,
    width: 100,
    height: 400,

    // bar
    barBeginCircle: 0, // percents
    barWidth: 15, // percents
    barStrokeWidth: 0, // pixels
    colorBarStroke: '#222222',
    colorBar: '#eeeeee',
    colorBarEnd: '',

    title: 'Temperature',
    units: '°C'
});

/* istanbul ignore next: private, not testable */
/**
 * Draws rectangle on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {number} r radius for founded corner rectangle if 0 or less won't be drawn
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {number} w width of the rectangle
 * @param {number} h height of the rectangle
 * @param {string} colorStart base fill color of the rectangle
 * @param {string} [colorEnd] gradient color of the rectangle
 */
function drawRectangle(context, r, x, y, w, h, colorStart, colorEnd) {
    context.beginPath();
    context.fillStyle = colorEnd ?
        drawings.linearGradient(context, colorStart, colorEnd, w > h ? w: h)
        : colorStart;

    (r > 0)  ?
        drawings.roundRect(context, x, y, w, h, r) :
        context.rect(x, y, w, h);

    context.fill();
    context.closePath();
    context.save();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearBar(context, options, x, y, w, h) {
    if (!options.barWidth) {
        return ; // no bar configured
    }
    // todo: allow use shadow

    let length = .9;
    let len, wid, ang;
    let isVertical = h >= w;

    if (isVertical) {
        len = h;
        wid = w;
        ang = 270;
    }

    else {
        len = w;
        wid = h;
        ang = 0;
    }

    if (options.title) length -= .1;
    if (options.units) length -= .1;

    length = len * length;

    context.save();
    context.beginPath();

    let ds = options.barStrokeWidth / 2;
    let bw = (options.barWidth / 100 * wid) - ds;

    if (options.barBeginCircle) {
        let r = (options.barBeginCircle / 100 * wid) / 2;
        let cAngle = drawings.radians(ang);
        let baseAngle = Math.atan((bw / 2) / r);
        let sAngle = cAngle + baseAngle;
        let eAngle = cAngle - baseAngle;
        let sinba = Math.sin(baseAngle);
        let cosba = Math.cos(baseAngle);
        let arcX = isVertical ?
            x + wid / 2 : x + (len - length) / 2 + r;
        let arcY = isVertical ?
            y + (len - length) / 2 + length - r : y + wid / 2;
        let lx = isVertical ? (arcX - r * sinba) :
            (arcX + r * cosba - ds);
        let ly = isVertical ?
            (arcY - r * cosba + ds) :
            (arcY - r * sinba);

        context.arc(arcX, arcY, r, sAngle, eAngle);

        context.moveTo(lx, ly);
        isVertical ? (ly = ly - length + r * 2) : (lx = lx + length - r * 2);
        context.lineTo(lx, ly);
        isVertical ? (lx = lx + bw) : (ly = ly + bw + ds / 5);
        context.lineTo(lx, ly);
        lx = isVertical ? (arcX + r * sinba) :
            (arcX + r * cosba - ds);
        ly = isVertical ?
            (arcY - r * cosba + ds) :
            (arcY + r * sinba + ds / 2);
        context.lineTo(lx, ly);
    }

    else {
        // simply rectangle
        // vertical
        let rx = isVertical ?
            (x +  wid / 2 - bw / 2) : (x + (len - length) / 2);
        let ry = isVertical ?
            (y + (len - length) / 2) : (y +  wid / 2 - bw / 2);

        context.rect(rx, ry, isVertical ?
            bw : length, isVertical ? length : bw);
    }

    if (options.colorBar) {
        context.fillStyle = options.colorBarEnd ?
            drawings.linearGradient(context, options.colorBar,
                options.colorBarEnd, length) : options.colorBar;
        context.fill();
    }

    if (options.barStrokeWidth) {
        context.lineWidth = options.barStrokeWidth;
        context.strokeStyle = options.colorBarStroke;
        context.stroke();
    }

    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar major ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearMajorTicks(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar major tick numbers
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearMajorTicksNumbers(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar minor ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearMinorTicks(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar highlighted areas
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearBarHighlights(context, options, x, y, w, h) {

}


/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar progress
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearBarProgress(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar needle
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearBarNeedle(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's title
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearTitle(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's units
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearUnits(context, options, x, y, w, h) {

}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge plate
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawLinearPlate(context, options, x, y, w, h) {
    context.save();

    let r = options.borderRadius;

    let w1 = w - options.borderShadowWidth;
    let w2 = w1 - options.borderOuterWidth * 2;
    let w3 = w2 - options.borderMiddleWidth * 2;
    let w4 = w3 - options.borderInnerWidth * 2;

    let h1 = h - options.borderShadowWidth * 2;
    let h2 = h1 - options.borderOuterWidth * 2;
    let h3 = h2 - options.borderMiddleWidth * 2;
    let h4 = h3 - options.borderInnerWidth * 2;

    let x2 = x - (w2 - w1) / 2;
    let x3 = x2 - (w3 - w2) / 2;
    let x4 = x3 - (w4 - w3) / 2;

    let y2 = y - (h2 - h1) / 2;
    let y3 = y2 - (h3 - h2) / 2;
    let y4 = y3 - (h4 - h3) / 2;

    if (options.glow) {
        context.shadowBlur = options.borderShadowWidth;
        context.shadowColor = options.colorBorderShadow;
    }

    if (options.borderOuterWidth) {
        drawRectangle(context, r, x, y, w1, h1,
            options.colorBorderOuterStart, options.colorBorderOuterEnd);
    }

    context.shadowBlur = null;
    context.shadowColor = null;

    if (options.borderMiddleWidth) {
        drawRectangle(context, --r, x2, y2, w2, h2,
            options.colorBorderMiddleStart, options.colorBorderMiddleEnd);
    }

    if (options.borderInnerWidth) {
        drawRectangle(context, --r, x3, y3, w3, h3,
            options.colorBorderInnerStart, options.colorBorderInnerEnd);
    }

    drawRectangle(context, r, x4, y4, w4, h4, options.colorPlate);

    return [x4, y4, w4, h4];
}

/**
 * Minimalistic HTML5 Canvas Linear Gauge
 */
export default class LinearGauge extends BaseGauge {

    /**
     * @constructor
     * @param {LinearGaugeOptions} options
     */
    constructor(options) {
        /* istanbul ignore else */
        if (!options.width) options.width = defaultLinearGaugeOptions.width;
        /* istanbul ignore else */
        if (!options.height) options.height = defaultLinearGaugeOptions.height;

        /* istanbul ignore else */
        if (!options.orientation) {
            options.orientation = options.width > options.height ?
                'horizontal' : 'vertical';
        }

        options = Object.assign({}, defaultLinearGaugeOptions, options || {});

        super(options);
    }

    /* istanbul ignore next */
    /**
     * Triggering linear gauge render on a canvas.
     *
     * @returns {LinearGauge}
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

            let drawBox = drawLinearPlate(context, options, x, y, w, h);

            drawLinearTitle(context, options, ...drawBox);
            drawLinearUnits(context, options, ...drawBox);
            drawLinearBar(context, options, ...drawBox);
            drawLinearMajorTicks(context, options, ...drawBox);
            drawLinearMinorTicks(context, options, ...drawBox);
            drawLinearMajorTicksNumbers(context, options, ...drawBox);
            drawLinearBarHighlights(context, options, ...drawBox);

            canvas.elementClone.initialized = true;
        }

        this.canvas.commit();

        // clear the canvas
        canvas.context.clearRect(x, y, w, h);
        canvas.context.save();

        canvas.context.drawImage(canvas.elementClone, x, y, w, h);
        canvas.context.save();

        drawLinearBarProgress(canvas.context, options, x, y, w, h);
        drawLinearBarNeedle(canvas.context, options, x, y, w, h);

        return this;
    }

}

window['LinearGauge'] = LinearGauge;

BaseGauge.initialize('LinearGauge', defaultLinearGaugeOptions);

module.exports = LinearGauge;
