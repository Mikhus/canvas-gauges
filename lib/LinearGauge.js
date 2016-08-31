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
const SmartCanvas = require('./SmartCanvas');

/**
 * Linear gauge configuration options
 *
 * @typedef {GenericOptions|{orientation: string, borderRadius: number, barBeginCircle: number, barWidth: number, barStrokeWidth: number, colorBar: string, colorBarEnd: string, colorBarStroke: string, tickSide: string, needleSide: string, numberSide: string}} LinearGaugeOptions
 */

/**
 * Default linear gauge configuration options
 *
 * @type {LinearGaugeOptions}
 */
let defaultLinearGaugeOptions = Object.assign({}, GenericOptions, {
    // basic options
    borderRadius: 0,
    width: 150,
    height: 400,

    // bar
    barBeginCircle: 20, // percents
    barWidth: 15, // percents
    barStrokeWidth: 0, // pixels

    colorBarStroke: '#222222',
    colorBar: '#cccccc',
    colorBarEnd: '',
    colorBarProgress: '',
    colorBarProgressEnd: '',

    tickSide: 'both', // available: 'left', 'right', 'both'
    needleSide: 'both', // available: 'left', 'right', 'both'

    numberSide: 'both' // available: 'left', 'right', 'both'
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
 * Calculates and returns linear gauge base bar dimensions.
 *
 * @param {LinearGaugeOptions} options
 * @param {number} w
 * @param {number} h
 * @return {[number, number, number, number, boolean, number, number, number]}
 */
function barDimensions(options, w, h) {
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

    let pixelRatio = SmartCanvas.pixelRatio;
    let ds = options.barStrokeWidth * pixelRatio / 2;
    let bw = (options.barWidth / 100 * wid) - ds;
    let r = (options.barBeginCircle / 100 * wid) / 2;

    return [wid, len, ang, length, isVertical, ds, bw, r];
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

    let [wid, len, ang, length, isVertical, ds, bw, r] =
        barDimensions(options, w, h);

    context.save();
    context.beginPath();

    if (options.barBeginCircle) {
        let cAngle = drawings.radians(ang);
        let baseAngle = Math.atan((bw / 2) / r);
        let sAngle = cAngle + baseAngle;
        let eAngle = cAngle - baseAngle;
        let sinba = Math.sin(baseAngle);
        let cosba = Math.cos(baseAngle);
        let arcX = isVertical ?
            x + wid / 2 :
            x + (len - length) / 2 + r;
        let arcY = isVertical ?
            y + (len - length) / 2 + length - r :
            y + wid / 2;
        let lx = isVertical ?
            (arcX - r * sinba - ds / 2) :
            (arcX + r * cosba - ds / 2);
        let ly = isVertical ?
            (arcY - r * cosba + ds / 2) :
            (arcY - r * sinba - ds / 2);

        context.arc(arcX, arcY, r, sAngle, eAngle);
        context.moveTo(lx, ly);

        isVertical ?
            (ly = ly - length + r * 2 - ds / 2) :
            (lx = lx + length - r * 2 + ds / 2);

        context.lineTo(lx, ly);

        isVertical ?
            (lx = lx + bw - ds / 2) :
            (ly = ly + bw - ds / 2);

        context.lineTo(lx, ly);

        lx = isVertical ?
            (arcX + r * sinba + ds / 2) :
            (arcX + r * cosba - ds / 2);
        ly = isVertical ?
            (arcY - r * cosba + ds / 2) :
            ly;

        context.lineTo(lx, ly);
    }

    else {
        // simply rectangle
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
 * Draws a tick line on a linear gauge
 *
 * @param {Canvas2DContext} context
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
function drawLinearTick(context, x1, y1, x2, y2) {
    context.beginPath();

    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    context.closePath();
    context.save();
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
    let [wid, len, ang, length, isVertical, ds, bw, r] =
        barDimensions(options, w, h);

    let s = options.majorTicks.length;
    let pixelRatio = SmartCanvas.pixelRatio;
    let hasLeft = options.tickSide !== 'right';
    let hasRight = options.tickSide !== 'left';
    let lw = 2 * pixelRatio;
    let tx, ty, i, dx, dy;

    context.lineWidth = lw;
    context.strokeStyle = options.colorMajorTicks;
    context.save();

    if (s === 0) {
        options.majorTicks.push(drawings.formatMajorTickNumber(
            options.minValue, options));
        options.majorTicks.push(drawings.formatMajorTickNumber(
            options.maxValue, options));
        s = 2;
    }

    let dlen = (len - length) / 2;
    let d = r * 2;

    length = length - lw * 2 - d;

    // left
    if (hasLeft) {
        if (isVertical) {
            tx = x + w / 2 - bw / 2 - .05 * w;
            dx = .1 * w;
            dy = 0;
        }

        else {
            dx = 0;
            dy = .1 * h;
            ty = y + h / 2 - bw / 2 - .05 * h;
        }

        for (i = 0; i < s; ++i) {
            if (isVertical)
                ty = y + dlen + length - i * length / (s - 1) + lw * 2;
            else
                tx = x + dlen + d + i * length / (s - 1) - lw / 2;

            drawLinearTick(context, tx, ty, tx - dx, ty - dy);
        }
    }

    // right
    if (hasRight) {
        if (isVertical) {
            dx = .1 * w;
            dy = 0;
            tx = x + w / 2 + bw / 2 + .05 * w;
        }

        else {
            dx = 0;
            dy = .1 * h;
            ty = y + h / 2 + bw / 2 + .05 * h;
        }

        for (i = 0; i < s; ++i) {
            if (isVertical)
                ty = y + dlen + length - i * length / (s - 1) + lw * 2;
            else
                tx = x + dlen + d + i * length / (s - 1) - lw / 2;

            drawLinearTick(context, tx, ty, tx + dx, ty + dy);
        }
    }
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
    let [wid, len, ang, length, isVertical, ds, bw, r] =
        barDimensions(options, w, h);
    let s = options.majorTicks.length;
    let hasLeft = options.numberSide !== 'right';
    let hasRight = options.numberSide !== 'left';
    let pixelRatio = SmartCanvas.pixelRatio;
    let lw = 2 * pixelRatio;
    let dlen = (len - length) / 2;
    let d = r * 2;
    let th = 20 * ((isVertical ? w : h) / 200);
    let tx, ty, i, dx, dy;

    length = length - lw * 2 - d;

    context.font = th + 'px Arial';
    context.fillStyle = options.colorNumbers;
    context.lineWidth = 0;
    context.textAlign = 'center';

    // left
    if (hasLeft) {
        if (isVertical) {
            context.textAlign = 'left';
            tx = x + w / 2 - bw / 2 - .15 * w;
        }

        else {
            ty = y + h / 2 - bw / 2 - .12 * h - th / 2;
        }

        dx = 0;

        for (i = 0; i < s; ++i) {
            if (isVertical) {
                ty = y + dlen + length - i * length / (s - 1) + lw * 2 + th / 3;
                dx = .05 * w + context.measureText(options.majorTicks[i]).width;
            }

            else {
                tx = x + dlen + d + i * length / (s - 1) - lw / 2;
            }


            context.fillText(options.majorTicks[i], tx - dx, ty);
        }
    }

    // right
    if (hasRight) {
        if (isVertical) {
            context.textAlign = 'right';
            tx = x + w / 2 + bw / 2 + .15 * w;
        }

        else {
            ty = y + h / 2 + bw / 2 + .12 * h + 1.25 * th;
        }

        for (i = 0; i < s; ++i) {
            if (isVertical) {
                ty = y + dlen + length - i * length / (s - 1) + lw * 2 + th / 3;
                dx = .05 * w + context.measureText(options.majorTicks[i]).width;
            }

            else {
                tx = x + dlen + d + i * length / (s - 1) - lw / 2;
            }

            context.fillText(options.majorTicks[i], tx + dx, ty);
        }
    }

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

            drawLinearMajorTicks(context, options, ...drawBox);
            drawLinearMinorTicks(context, options, ...drawBox);
            drawLinearMajorTicksNumbers(context, options, ...drawBox);
            drawLinearTitle(context, options, ...drawBox);
            drawLinearUnits(context, options, ...drawBox);
            drawLinearBar(context, options, ...drawBox);
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
