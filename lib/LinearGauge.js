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
 * @typedef {GenericOptions|{orientation: string, borderRadius: number, barBeginCircle: number, barWidth: number, barStrokeWidth: number, barProgress: boolean, colorBar: string, colorBarEnd: string, colorBarStroke: string, colorBarProgress: string, colorBarProgressEnd: string, tickSide: string, needleSide: string, numberSide: string}} LinearGaugeOptions
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
    barBeginCircle: 30, // percents
    barWidth: 20, // percents
    barStrokeWidth: 0, // pixels
    barProgress: true,

    colorBarStroke: '#222222',
    colorBar: '#cccccc',
    colorBarEnd: '',
    colorBarProgress: '#c33',
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
 * @param {Canvas2DContext} context
 * @param {{barStrokeWidth: number, barBeginCircle: number, barWidth: number}} options
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @return {{isVertical: boolean, width: number, length: number, barWidth: number, barLength: number, strokeWidth: number, barMargin: number, radius: number, x0: number, y0: number, barOffset: number}}
 */
function barDimensions(context, options, x, y, w, h) {
    let pixelRatio = SmartCanvas.pixelRatio;
    let isVertical = h >= w;
    let width = isVertical ? w : h;
    let length = isVertical ? h : w;

    let strokeWidth = options.barStrokeWidth * 2;
    let barWidth = Math.round(width * options.barWidth / 100 - strokeWidth);
    let radius = options.barBeginCircle ?
        Math.round(width * options.barBeginCircle / 200 - strokeWidth / 2) :
        0;
    let barLength = Math.round(length * .85 - strokeWidth);
    let barMargin = Math.round((length - barLength) / 2);

    let x0 = Math.round(x + (isVertical ? w / 2 : barMargin + radius));
    let y0 = Math.round(y + (isVertical ? h - barMargin - radius : h / 2));

    // todo: fix it!
    // if (options.title) barLength -= Math.round(length * .075);
    // if (options.units) barLength -= Math.round(length * .075);

    //noinspection JSUndefinedPropertyAssignment
    context.barDimensions = {
        isVertical: isVertical,
        width: width,
        length: length,
        barWidth: barWidth,
        barLength: barLength,
        strokeWidth: strokeWidth,
        barMargin: barMargin,
        radius: radius,
        pixelRatio: pixelRatio,
        x0: x0,
        y0: y0,
        barOffset: null
    };

    return context.barDimensions;
}


/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar shape from the given options on a given
 * canvas context
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {number} barOpWidth
 * @param {number} barStrokeWidth
 * @param {string} strokeColor
 * @param {number} circleRadius
 * @param {string} colorStart
 * @param {string} colorEnd
 * @param {number|boolean} toValue
 * @param {number} minValue
 * @param {number} maxValue
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawLinearBarShape(context, barOpWidth, barStrokeWidth, strokeColor,
                            circleRadius, colorStart, colorEnd, toValue,
                            minValue, maxValue, x, y, w, h)
{
    let {isVertical, width, barWidth, barLength, strokeWidth,
        barMargin, radius, x0, y0} =
        barDimensions(context, {
            barStrokeWidth: barStrokeWidth,
            barBeginCircle: circleRadius,
            barWidth: barOpWidth
        }, x, y, w, h);

    context.save();
    context.beginPath();

    if (circleRadius) {
        let direction = drawings.radians(isVertical ? 270 : 0);
        let alpha = Math.asin(barWidth / 2 / radius);
        let cosAlpha = Math.cos(alpha);
        let sinAlpha = Math.sin(alpha);

        // top point
        let x1 = Math.round(x0 + (isVertical ?
            radius * sinAlpha :
            radius * cosAlpha - strokeWidth / 2));
        let y1 = Math.round(isVertical ?
        y0 - radius * cosAlpha:
        y0 + radius * sinAlpha);

        context.barDimensions.barOffset = Math.round(isVertical ?
            (Math.abs(y1 - y0) + radius) :
            (Math.abs(x1 - x0) + radius));

        // bottom point
        let x2 = isVertical ? Math.round(x0 - radius * sinAlpha) : x1;
        let y2 = isVertical ? y1 : Math.round(y0 - radius * sinAlpha);

        if (toValue !== false) {
            barLength = context.barDimensions.barOffset +
                (barLength - context.barDimensions.barOffset) *
                (toValue / (maxValue - minValue));
        }

        // bar ends at
        let x3 = Math.round(x1 + barLength - context.barDimensions.barOffset +
            strokeWidth / 2); // h
        let y3 = Math.round(y1 - barLength + context.barDimensions.barOffset -
            strokeWidth / 2); // v

        context.arc(x0, y0, radius, direction + alpha, direction - alpha);

        if (isVertical) {
            context.moveTo(x1, y2);
            context.lineTo(x1, y3);
            context.lineTo(x2, y3);
            context.lineTo(x2, y2);
        }

        else {
            context.moveTo(x1, y2);
            context.lineTo(x3, y2);
            context.lineTo(x3, y1);
            context.lineTo(x1, y1);
        }
    }

    else {
        // simply rectangle
        let rx = Math.round(isVertical ?
            (x +  (width - barWidth) / 2) : (x + barMargin));
        let ry = Math.round(isVertical ?
            (y + barLength + barMargin) : (y +  (width - barWidth) / 2));

        if (toValue !== false) {
            barLength *= toValue / (maxValue - minValue);
        }

        if (isVertical) context.rect(rx, ry, barWidth, -barLength);
        else context.rect(rx, ry, barLength, barWidth);
    }

    if (barStrokeWidth) {
        context.lineWidth = strokeWidth;
        context.strokeStyle = strokeColor;
        //context.lineJoin = 'round';
        context.stroke();
    }

    if (colorStart) {
        context.fillStyle = colorEnd ?
            drawings.linearGradient(context, colorStart, colorEnd, barLength):
            colorStart;
        context.fill();
    }

    context.closePath();

    // fix dimensions for further usage
    context.barDimensions.radius += strokeWidth;
    context.barDimensions.barWidth += strokeWidth;
    context.barDimensions.barLength += strokeWidth / 2;
}

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
    drawLinearBarShape(context,
        options.barWidth,
        options.barStrokeWidth,
        options.colorBarStroke,
        options.barBeginCircle,
        options.colorBar,
        options.colorBarEnd,
        false,
        options.minValue,
        options.maxValue,
        x, y, w, h);
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
    options.barProgress && drawLinearBarShape(context,
        options.barWidth,
        options.barStrokeWidth,
        'rgba(0,0,0,0)',
        options.barBeginCircle,
        options.colorBarProgress,
        options.colorBarProgressEnd,
        options.value,
        options.minValue,
        options.maxValue,
        x, y, w, h);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar highlighted areas
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 */
function drawLinearBarHighlights(context, options, x, y) {
    let {isVertical, width, length, barWidth, barLength, barOffset, barMargin} =
        context.barDimensions;

    if (!options.highlights) return ;

    let hasLeft = options.tickSide !== 'right';
    let hasRight = options.tickSide !== 'left';
    let i = 0;
    let s = options.highlights.length;
    let ticksLength = barLength - barOffset;
    let tickOffset = (width - barWidth) / 2;
    let interval = options.maxValue - options.minValue;
    let eX = isVertical ? x + tickOffset : x + barMargin + barOffset;
    let eH = .1 * width;
    let eY = isVertical ? y + length - barMargin - barOffset: y + tickOffset;

    context.save();

    for (; i < s; i++) {
        let entry = options.highlights[i];
        let eW = ticksLength * Math.abs((entry.to - entry.from) / interval);

        context.beginPath();
        context.fillStyle = entry.color;

        if (isVertical) {
            if (hasLeft)
                context.rect(eX - .15 * width, eY, eH, -eW);

            if (hasRight)
                context.rect(eX + barWidth + .05 * width, eY, eH, -eW);

            eY -= eW;
        }

        else {
            if (hasLeft)
                context.rect(eX, eY - .15 * width, eW, eH);

            if (hasRight)
                context.rect(eX, eY + barWidth + .05 * width, eW, eH);

            eX += eW;
        }

        context.fill();
        context.closePath();
    }
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
 *
 * @param {Canvas2DContext} context
 * @param {string} color
 * @param {number} ticksLength
 * @param {number} deltaLen
 * @param {boolean} hasLeft
 * @param {boolean} hasRight
 * @param {number} lineWidth
 * @param {number} x
 * @param {number} y
 * @param {number} lineLength
 */
function drawLinearTicks(context,  color, ticksLength, deltaLen,
                         hasLeft, hasRight, lineWidth, x, y, lineLength)
{
    let {isVertical, length, barWidth, barLength, barOffset, barMargin,
        pixelRatio, width} = context.barDimensions;
    let tickLength = barLength - barOffset;
    let tickOffset = (width - barWidth) / 2;
    let tickX, tickY, tickWidth, tickHeight;
    let i = 0;

    context.lineWidth = lineWidth * pixelRatio;
    context.strokeStyle = color;
    context.save();

    for (; i < ticksLength; i++) {
        if (isVertical) {
            tickWidth = lineLength * width;
            tickY = y + length - barMargin - barOffset -
                i * tickLength / (ticksLength - deltaLen);

            if (hasLeft)
                tickX = x + tickOffset - .05 * width;

            if (hasRight)
                tickX = x + tickOffset + barWidth + tickWidth + .05 * width;

            drawLinearTick(context, tickX, tickY, tickX - tickWidth, tickY);
        }

        else {
            tickHeight = lineLength * width;
            tickX = x + barMargin + barOffset +
                i * tickLength / (ticksLength - deltaLen);

            if (hasLeft)
                tickY = y + tickOffset - .05 * width;

            if (hasRight)
                tickY = y + tickOffset + barWidth + tickHeight + .05 * width;

            drawLinearTick(context, tickX, tickY, tickX, tickY - tickHeight);
        }
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Prepares major ticks data
 *
 * @access private
 * @param {LinearGaugeOptions} options
 * @return {[boolean, boolean]}
 */
function prepareTicks(options) {
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
 * Draws linear gauge's bar major ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 */
function drawLinearMajorTicks(context, options, x, y) {
    let [hasLeft, hasRight] = prepareTicks(options);

    drawLinearTicks(context, options.colorMajorTicks,
        options.majorTicks.length, 1, hasLeft, hasRight, 2, x, y, .1);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge's bar minor ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 */
function drawLinearMinorTicks(context, options, x, y) {
    let [hasLeft, hasRight] = prepareTicks(options);

    drawLinearTicks(context, options.colorMajorTicks,
        options.minorTicks * (options.majorTicks.length - 1), 0,
        hasLeft, hasRight, 1, x, y, .05);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge'ticks bar major tick numbers
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 */
function drawLinearMajorTicksNumbers(context, options, x, y) {
    let {isVertical, length, width, barWidth, barLength,
        barMargin, barOffset} = context.barDimensions;
    let ticks = options.majorTicks.length;
    let hasLeft = options.numberSide !== 'right';
    let hasRight = options.numberSide !== 'left';
    let textHeight = 20 * width / 200;
    let i = 0;
    let textX, textY, textWidth, numberOffset;

    context.font = textHeight + 'px Arial';
    context.fillStyle = options.colorNumbers;
    context.lineWidth = 0;
    context.textAlign = 'center';

    for (; i < ticks; i++) {
        numberOffset = i * (barLength - barOffset) / (ticks - 1);

        if (isVertical) {
            textY = y + length - barMargin - barOffset - numberOffset
                + textHeight / 3;

            if (hasLeft) {
                context.textAlign = 'right';
                textX = Math.round(x + (width - barWidth) / 2 - .2 * width);
            }

            if (hasRight) {
                context.textAlign = 'left';

                textX = Math.round(x + (width - barWidth) / 2 +
                    barWidth + .2 * width);
            }
        }

        else {
            textWidth = context.measureText(options.majorTicks[i]).width;
            textX = x + barMargin + barOffset + numberOffset;

            if (hasLeft)
                textY = y + (width - barWidth) / 2 - .2 * width;

            if (hasRight)
                textY = y + (width - barWidth) / 2 + barWidth + .2 * width +
                    textHeight;
        }

        context.fillText(options.majorTicks[i], textX, textY);
    }
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
    //noinspection JSValidateTypes
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

            this.drawBox = drawLinearPlate(context, options, x, y, w, h);

            drawLinearBar(context, options, ...this.drawBox);

            canvas.context.barDimensions = context.barDimensions;

            drawLinearBarHighlights(context, options, ...this.drawBox);
            drawLinearMinorTicks(context, options, ...this.drawBox);
            drawLinearMajorTicks(context, options, ...this.drawBox);
            drawLinearMajorTicksNumbers(context, options, ...this.drawBox);
            drawLinearTitle(context, options, ...this.drawBox);
            drawLinearUnits(context, options, ...this.drawBox);

            canvas.elementClone.initialized = true;
        }

        this.canvas.commit();

        // clear the canvas
        canvas.context.clearRect(x, y, w, h);
        canvas.context.save();

        canvas.context.drawImage(canvas.elementClone, x, y, w, h);
        canvas.context.save();

        drawLinearBarProgress(canvas.context, options, ...this.drawBox);
        drawLinearBarNeedle(canvas.context, options, ...this.drawBox);

        return this;
    }

}

window['LinearGauge'] = LinearGauge;

BaseGauge.initialize('LinearGauge', defaultLinearGaugeOptions);

module.exports = LinearGauge;
