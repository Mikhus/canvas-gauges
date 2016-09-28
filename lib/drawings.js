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

/**
 * @access private
 * @typedef {CanvasRenderingContext2D|{max: number, maxRadius: number, barDimensions: object}} Canvas2DContext
 */

/* istanbul ignore next: private, not testable */
/**
 * Examines if a given error is something to throw or to ignore
 *
 * @param {Error} err
 */
export function verifyError(err) {
    // there is some unpredictable error in FF in some circumstances
    // which we found simply safe to ignore than to fight with it
    // noinspection JSUnresolvedVariable
    if (err instanceof DOMException && err.result === 0x8053000b) {
        return ; // ignore it
    }

    throw err;
}

/* istanbul ignore next: private, not testable */
/**
 * Prepares major ticks data
 *
 * @access private
 * @param {GenericOptions|{ tickSide: string }} options
 * @return {[boolean, boolean]}
 */
export function prepareTicks(options) {
    if (!(options.majorTicks instanceof Array)) {
        options.majorTicks = options.majorTicks ? [options.majorTicks] : [];
    }

    if (!options.majorTicks.length) {
        options.majorTicks.push(drawings.formatMajorTickNumber(
            options.minValue, options));
        options.majorTicks.push(drawings.formatMajorTickNumber(
            options.maxValue, options));
    }

    return [options.tickSide !== 'right', options.tickSide !== 'left'];
}

/* istanbul ignore next: private, not testable */
/**
 * Draws rounded corners rectangle
 *
 * @param {Canvas2DContext} context
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
export function roundRect(context, x, y, w, h, r) {
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
 * Pads a given value with leading zeros using the given options
 *
 * @param {number} val
 * @param {RadialGaugeOptions|{valueInt: number, valueDec: number}} options
 * @returns {string}
 */
export function padValue(val, options) {
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
 * Formats a number for display on the dial's plate using the majorTicksFormat
 * config option.
 *
 * @param {number} num number to format
 * @param {object} options
 * @returns {string} formatted number
 */
export function formatMajorTickNumber(num, options) {
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
export function radians(degrees) {
    return degrees * Math.PI / 180;
}

/* istanbul ignore next: private, not testable */
/**
 * Calculates and returns radial point coordinates
 *
 * @param {number} radius
 * @param {number} angle
 * @returns {{x: number, y: number}}
 */
export function radialPoint(radius, angle) {
    return { x: -radius * Math.sin(angle), y: radius * Math.cos(angle) };
}

/* istanbul ignore next: private, not testable */
/**
 * Creates and returns linear gradient canvas object
 *
 * @param {Canvas2DContext} context
 * @param {string} colorFrom
 * @param {string} colorTo
 * @param {number} length
 * @param {boolean} [isVertical]
 * @param {number} [from]
 * @returns {CanvasGradient}
 */
export function linearGradient(context, colorFrom, colorTo, length,
                               isVertical = true, from = 0)
{
    let grad = context.createLinearGradient(
        isVertical ? 0 : from,
        isVertical ? from : 0,
        isVertical ? 0 : length,
        isVertical ? length : 0);

    grad.addColorStop(0, colorFrom);
    grad.addColorStop(1, colorTo);

    return grad;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws the shadow if it was not drawn
 *
 * @param {Canvas2DContext} context
 * @param {GenericOptions} options
 * @param {boolean} shadowDrawn
 * @return {boolean}
 */
export function drawShadow(context, options, shadowDrawn = false) {
    if (shadowDrawn) {
        context.restore();
        return true;
    }

    context.save();

    let w =  options.borderShadowWidth;

    if (w) {
        context.shadowBlur = w;
        context.shadowColor = options.colorBorderShadow;
    }

    return true;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge needle shadow
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {RadialGaugeOptions} options
 */
export function drawNeedleShadow(context, options) {
    if (!options.needleShadow) return;

    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 10;
    context.shadowColor = options.colorNeedleShadowDown;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws value box at given position
 *
 * @param {Canvas2DContext} context
 * @param {GenericOptions} options
 * @param {number|string} value
 * @param {number} x
 * @param {number} y
 * @param {number} max
 */
export function drawValueBox(context, options, value, x, y, max) {
    if (!options.valueBox) return;

    let text = options.valueText || padValue(value, options);

    context.shadowOffsetX = null;
    context.shadowOffsetY = null;
    context.shadowBlur = null;
    context.shadowColor = '';
    context.strokeStyle = null;
    context.lineWidth = 0;
    context.save();

    context.font = options.fontValueStyle + ' ' +
        options.fontValueWeight + ' ' +
        options.fontValueSize * (max / 200) + 'px ' +
        options.fontValue;
    context.save();
    context.beginPath();

    let th = 0.12 * max;
    let bs = parseFloat(options.valueBoxStroke) || 0;
    let bmax = max * 2 - bs * 2;
    let tw = context.measureText(options.valueText ?
        text : ('-' + padValue(0, options))).width;
    let bw = tw + 0.05 * max;
    let bh = th + 0.07 * max;
    let br = max * options.valueBoxBorderRadius / 100;
    let obw = (parseFloat(options.valueBoxWidth) || 0) / 100 * bmax;

    (obw > bw) && (bw = obw);
    (bw > bmax) && (bw = bmax);

    let bx = x - bw / 2;
    let by = y - th - 0.04 * max;

    if (br) roundRect(context, bx, by, bw, bh, br);
    else  context.rect(bx, by, bw, bh);

    let gy = y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2;

    if (options.valueBoxStroke) {
        let grd = context.createRadialGradient(x, gy, max / 10, x, gy, max / 5);

        grd.addColorStop(0, options.colorValueBoxRect);
        grd.addColorStop(1, options.colorValueBoxRectEnd);

        context.strokeStyle = grd;
        context.lineWidth = max * options.valueBoxStroke / 100;
        context.stroke();
    }

    if (options.colorValueBoxShadow) {
        context.shadowBlur = 0.012 * max;
        context.shadowColor = options.colorValueBoxShadow;
    }

    if (options.colorValueBoxBackground) {
        context.fillStyle = options.colorValueBoxBackground;
        context.fill();
    }

    context.closePath();
    context.restore();

    if (options.valueTextShadow) {
        context.shadowOffsetX = 0.004 * max;
        context.shadowOffsetY = 0.004 * max;
        context.shadowBlur = 0.012 * max;
        context.shadowColor = options.colorValueTextShadow;
    }

    context.fillStyle = options.colorValueText;
    context.textAlign = 'center';
    context.fillText(text, -x, y);
    context.restore();
}

const drawings = {
    roundRect: roundRect,
    padValue: padValue,
    formatMajorTickNumber: formatMajorTickNumber,
    radians: radians,
    radialPoint: radialPoint,
    linearGradient: linearGradient,
    drawNeedleShadow: drawNeedleShadow,
    drawValueBox: drawValueBox,
    verifyError: verifyError,
    prepareTicks: prepareTicks,
    drawShadow: drawShadow
};

export default drawings;

module.exports = drawings;
