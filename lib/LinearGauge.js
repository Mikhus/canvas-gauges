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

const BaseGauge = require('./BaseGauge');
const GenericOptions = require('./GenericOptions');
const drawings = require('./drawings');
const SmartCanvas = require('./SmartCanvas');

/**
 * Linear gauge configuration options
 *
 * @typedef {GenericOptions|{borderRadius: number, barBeginCircle: number, tickSide: string, needleSide: string, numberSide: string, ticksWidth: number, ticksWidthMinor: number, ticksPadding: number, barLength: number, colorBarEnd: string, colorBarProgressEnd: string}} LinearGaugeOptions
 */

/**
 * Default linear gauge configuration options
 *
 * @type {LinearGaugeOptions}
 */
let defaultLinearGaugeOptions = Object.assign({}, GenericOptions, {
    // basic options
    borderRadius: 0,
    // width: 150,
    // height: 400,

    // bar
    barBeginCircle: 30, // percents
    colorBarEnd: '',
    colorBarProgressEnd: '',

    needleWidth: 6,

    tickSide: 'both', // available: 'left', 'right', 'both'
    needleSide: 'both', // available: 'left', 'right', 'both'

    numberSide: 'both', // available: 'left', 'right', 'both'

    ticksWidth: 10,
    ticksWidthMinor: 5,
    ticksPadding: 5,
    barLength: 85,
    fontTitleSize: 26,

    highlightsWidth: 10
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
        drawings.linearGradient(context, colorStart, colorEnd,
            w > h ? w: h, h > w, w > h ? x : y) : colorStart;

    (r > 0)  ?
        drawings.roundRect(context, x, y, w, h, r) :
        context.rect(x, y, w, h);

    context.fill();
    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws rectangle on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {number} width width of the border
 * @param {number} r radius for founded corner rectangle if 0 or less won't be drawn
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {number} w width of the rectangle
 * @param {number} h height of the rectangle
 * @param {string} colorStart base fill color of the rectangle
 * @param {string} [colorEnd] gradient color of the rectangle
 */
function drawLinearBorder(context, width, r, x, y, w, h, colorStart, colorEnd) {
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = colorEnd ?
        drawings.linearGradient(context, colorStart, colorEnd, h, true, y) :
        colorStart;

    (r > 0)  ?
        drawings.roundRect(context, x, y, w, h, r) :
        context.rect(x, y, w, h);

    context.stroke();
    context.closePath();
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
    let pxRatio = SmartCanvas.pixelRatio;
    context.save();

    let r = options.borderRadius * pxRatio;
    let w1 = w - options.borderShadowWidth - options.borderOuterWidth * pxRatio;
    let w2 = w1 - options.borderOuterWidth * pxRatio -
        options.borderMiddleWidth * pxRatio;
    let w3 = w2 - options.borderMiddleWidth * pxRatio -
        options.borderInnerWidth * pxRatio;
    let w4 = w3 - options.borderInnerWidth * pxRatio;

    let h1 = h - options.borderShadowWidth - options.borderOuterWidth * pxRatio;
    let h2 = h1 - options.borderOuterWidth * pxRatio -
        options.borderMiddleWidth * pxRatio;
    let h3 = h2 - options.borderMiddleWidth * pxRatio -
        options.borderInnerWidth * pxRatio;
    let h4 = h3 - options.borderInnerWidth * pxRatio;

    let x2 = x - (w2 - w1) / 2;
    let x3 = x2 - (w3 - w2) / 2;
    let x4 = x3 - (w4 - w3) / 2;

    let y2 = y - (h2 - h1) / 2;
    let y3 = y2 - (h3 - h2) / 2;
    let y4 = y3 - (h4 - h3) / 2;
    let aliasingOffset = 0;
    let shadowDrawn = false;

    if (options.borderOuterWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawLinearBorder(context, options.borderOuterWidth * pxRatio,
            r,
            x + options.borderOuterWidth * pxRatio / 2 - aliasingOffset,
            y + options.borderOuterWidth * pxRatio / 2 - aliasingOffset,
            w1, h1,
            options.colorBorderOuter,
            options.colorBorderOuterEnd);
        aliasingOffset += 0.5 * pxRatio;
    }

    if (options.borderMiddleWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawLinearBorder(context, options.borderMiddleWidth * pxRatio,
            (r -= 1 + aliasingOffset * 2),
            x2 + options.borderMiddleWidth * pxRatio / 2 - aliasingOffset,
            y2 + options.borderMiddleWidth * pxRatio / 2 - aliasingOffset,
            w2 + aliasingOffset * 2,
            h2 + aliasingOffset * 2,
            options.colorBorderMiddle,
            options.colorBorderMiddleEnd);
        aliasingOffset += 0.5 * pxRatio;
    }

    if (options.borderInnerWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawLinearBorder(context,options.borderInnerWidth * pxRatio,
            (r -= 1 + aliasingOffset * 2),
            x3 + options.borderInnerWidth * pxRatio / 2 - aliasingOffset,
            y3 + options.borderInnerWidth * pxRatio / 2 - aliasingOffset,
            w3 + aliasingOffset * 2,
            h3 + aliasingOffset * 2,
            options.colorBorderInner,
            options.colorBorderInnerEnd);
        aliasingOffset += 0.5 * pxRatio;
    }

    drawings.drawShadow(context, options, shadowDrawn);

    drawRectangle(context, r, x4, y4,
        w4 + aliasingOffset * 2,
        h4 + aliasingOffset * 2,
        options.colorPlate,
        options.colorPlateEnd);

    context.restore();

    return [x4, y4, w4, h4];
}

/* istanbul ignore next: private, not testable */
/**
 * Calculates and returns linear gauge base bar dimensions.
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions|{barStrokeWidth: number, barBeginCircle: number, barWidth: number, hasLeft: boolean, hasRight: boolean}} options
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @return {{isVertical: boolean, width: number, length: number, barWidth: number, barLength: number, strokeWidth: number, barMargin: number, radius: number, x0: number, y0: number, barOffset: number, titleMargin: number, unitsMargin: number, X: number, Y: number, baseX: number, baseY: number, ticksPadding: number}}
 */
function barDimensions(context, options, x, y, w, h) {
    let pixelRatio = SmartCanvas.pixelRatio;
    let isVertical = h >= w;
    let width = isVertical ? w * 0.85 : h;
    let length = isVertical ? h : w;

    //noinspection JSUnresolvedFunction
    x = isVertical ? round(x + (w - width) / 2) : x;

    let hasTitle = !!options.title;
    let hasUnits = !!options.units;
    let hasValue = !!options.valueBox;

    let titleMargin;
    let unitsMargin;
    let valueMargin;

    if (isVertical) {
        //noinspection JSUnresolvedFunction
        unitsMargin = round(length * 0.05);
        //noinspection JSUnresolvedFunction
        titleMargin = round(length * 0.075);
        //noinspection JSUnresolvedFunction
        valueMargin = round(length * 0.11);

        if (hasTitle) {
            length -= titleMargin;
            y += titleMargin;
        }

        if (hasUnits) length -= unitsMargin;
        if (hasValue) length -= valueMargin;
    }

    else {
        //noinspection JSUnresolvedFunction
        unitsMargin = titleMargin = round(width * 0.15);

        if (hasTitle) {
            width -= titleMargin;
            y += titleMargin;
        }

        if (hasUnits) width -= unitsMargin;
    }

    let strokeWidth = options.barStrokeWidth * 2;
    //noinspection JSUnresolvedFunction
    let radius = options.barBeginCircle ?
        round(width * options.barBeginCircle / 200 - strokeWidth / 2) : 0;
    //noinspection JSUnresolvedFunction
    let barWidth = round(width * options.barWidth / 100 - strokeWidth);
    //noinspection JSUnresolvedFunction
    let barLength = round(length * options.barLength / 100 - strokeWidth);
    //noinspection JSUnresolvedFunction
    let barMargin = round((length - barLength) / 2);

    // coordinates for arc of the bar if configured
    //noinspection JSUnresolvedFunction
    let x0 = round(x + (isVertical ? width / 2 : barMargin + radius));
    //noinspection JSUnresolvedFunction
    let y0 = round(y + (isVertical ?
        length - barMargin - radius + strokeWidth / 2:
        width / 2));
    let dx = isVertical && !(options.hasLeft && options.hasRight) ?
        ((options.hasRight ? -1 : 1) * options.ticksWidth / 100 * width) : 0;
    let dy = !isVertical && !(options.hasLeft && options.hasRight) ?
        ((options.hasRight ? -1 : 1) * options.ticksWidth / 100 * width) : 0;

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
        barOffset: null,
        titleMargin: hasTitle ? titleMargin : 0,
        unitsMargin: hasUnits ? unitsMargin : 0,
        get ticksLength() {
            return this.barLength - this.barOffset - this.strokeWidth;
        },
        X: x + dx,
        Y: y + dy,
        x0: x0 + dx,
        y0: y0 + dy,
        baseX: x,
        baseY: y,
        ticksPadding: options.ticksPadding / 100
    };

    return context.barDimensions;
}


/* istanbul ignore next: private, not testable */
/**
 * Draws bar shape from the given options on a given canvas context
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {string} type
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawLinearBarShape(context, options, type, x, y, w, h) {
    let {isVertical, width, barWidth, barLength, strokeWidth, barMargin, radius,
        x0, y0, X, Y} = barDimensions(context, options, x, y, w, h);
    let fullBarLength = barLength;

    context.save();
    context.beginPath();

    if (options.barBeginCircle) {
        let direction = drawings.radians(isVertical ? 270 : 0);
        let alpha = Math.asin(barWidth / 2 / radius);
        let cosAlpha = Math.cos(alpha);
        let sinAlpha = Math.sin(alpha);

        let x1 = x0 + (isVertical ?
            radius * sinAlpha :
            radius * cosAlpha - strokeWidth / 2);
        let y1 = isVertical ?
            y0 - radius * cosAlpha:
            y0 + radius * sinAlpha;
        //noinspection JSUnresolvedFunction
        let cutRadius = isVertical ? abs(y1 - y0) : abs(x1 - x0);

        //noinspection JSUnresolvedFunction
        context.barDimensions.barOffset = round(cutRadius + radius);

        // bottom point
        //noinspection JSUnresolvedFunction
        let x2 = isVertical ? round(x0 - radius * sinAlpha) : x1;
        //noinspection JSUnresolvedFunction
        let y2 = isVertical ? y1 : round(y0 - radius * sinAlpha);

        if (type === 'progress') {
            barLength = context.barDimensions.barOffset +
                (barLength - context.barDimensions.barOffset) *
                (drawings.normalizedValue(options).normal - options.minValue) /
                (options.maxValue - options.minValue);
        }

        // bar ends at
        //noinspection JSUnresolvedFunction
        let x3 = round(x1 + barLength - context.barDimensions.barOffset +
            strokeWidth / 2); // h
        //noinspection JSUnresolvedFunction
        let y3 = round(y1 - barLength + context.barDimensions.barOffset -
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
        //noinspection JSUnresolvedFunction
        let rx = round(isVertical ?
            (X +  (width - barWidth) / 2) : (X + barMargin));
        //noinspection JSUnresolvedFunction
        let ry = round(isVertical ?
            (Y + barLength + barMargin) : (Y +  (width - barWidth) / 2));

        if (type === 'progress') {
            barLength *= (options.value - options.minValue) /
                (options.maxValue - options.minValue);
        }

        if (isVertical) context.rect(rx, ry, barWidth, -barLength);
        else context.rect(rx, ry, barLength, barWidth);
    }

    if (type !== 'progress' && options.barStrokeWidth) {
        context.lineWidth = strokeWidth;
        context.strokeStyle = options.colorBarStroke;
        //context.lineJoin = 'round';
        context.stroke();
    }

    if (type !== 'progress' && options.colorBar) {
        context.fillStyle = options.colorBarEnd ?
            drawings.linearGradient(context, options.colorBar,
                options.colorBarEnd, barLength, isVertical,
                isVertical ? Y : X):
            options.colorBar;
        context.fill();
    }

    else if (type === 'progress' && options.colorBarProgress) {
        context.fillStyle = options.colorBarProgressEnd ?
            drawings.linearGradient(context, options.colorBarProgress,
                options.colorBarProgressEnd, fullBarLength, isVertical,
                isVertical ? Y : X):
            options.colorBarProgress;
        context.fill();
    }

    context.closePath();

    // fix dimensions for further usage
    if (options.barBeginCircle)
        context.barDimensions.radius += strokeWidth;

    context.barDimensions.barWidth += strokeWidth;
    context.barDimensions.barLength += strokeWidth;
}

/**
 * Draws gauge bar
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearBar(context, options, x, y, w, h) {
    drawLinearBarShape(context, options, '', x, y, w, h);
}

/* istanbul ignore next: private, not testable */
/**
 * Helper function to calculate bar ticks presence on the sides
 *
 * @param {string} notWhich
 * @param {LinearGaugeOptions} options
 * @return {boolean}
 */
function hasTicksBar(notWhich, options) {
    return options.needleSide !== notWhich ||
            options.tickSide !== notWhich ||
            options.numberSide !== notWhich;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge bar progress
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} x x-coordinate of the top-left corner of the gauge
 * @param {number} y y-coordinate of the top-left corner of the gauge
 * @param {number} w width of the gauge
 * @param {number} h height of the gauge
 */
function drawLinearBarProgress(context, options, x, y, w, h) {
    options.barProgress &&
    drawLinearBarShape(context, options, 'progress', x, y, w, h);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge bar highlighted areas
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearBarHighlights(context, options) {
    let {isVertical, width, length, barWidth, barOffset, barMargin,
        X, Y, ticksLength, ticksPadding} = context.barDimensions;
    let hlWidth = width * (parseFloat(options.highlightsWidth) || 0) / 100;

    if (!options.highlights || !hlWidth) return ;

    let hasLeft = options.tickSide !== 'right';
    let hasRight = options.tickSide !== 'left';
    let i = 0;
    let s = options.highlights.length;
    let tickOffset = (width - barWidth) / 2;
    let interval = options.maxValue - options.minValue;
    //noinspection JSUnresolvedFunction
    let eX = round(isVertical ? X + tickOffset : X + barMargin + barOffset);
    let eH = hlWidth;
    let eY = isVertical ? Y + length - barMargin - barOffset: Y + tickOffset;
    //noinspection JSUnresolvedFunction
    let hLeft = round((options.ticksWidth / 100 + ticksPadding) * width)
        + (hlWidth - options.ticksWidth / 100 * width);
    //noinspection JSUnresolvedFunction
    let hRight = round(barWidth + ticksPadding * width);

    context.save();

    for (; i < s; i++) {
        let entry = options.highlights[i];
        //noinspection JSUnresolvedFunction
        let eStart = ticksLength * abs(options.minValue - entry.from) /
            interval;
        //noinspection JSUnresolvedFunction
        let eW = ticksLength * abs((entry.to - entry.from) / interval);

        context.beginPath();
        context.fillStyle = entry.color;

        if (isVertical) {
            if (hasLeft)
                context.rect(eX - hLeft, eY - eStart, eH, -eW);

            if (hasRight)
                context.rect(eX + hRight, eY - eStart, eH, -eW);
        }

        else {
            if (hasLeft)
                context.rect(eX + eStart, eY - hLeft, eW, eH);

            if (hasRight)
                context.rect(eX + eStart, eY + hRight, eW, eH);
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
 * Draws ticks
 *
 * @param {Canvas2DContext} context
 * @param {string} color
 * @param {number[]} ticks
 * @param {number} minVal
 * @param {number} maxVal
 * @param {boolean} hasLeft
 * @param {boolean} hasRight
 * @param {number} lineWidth
 * @param {number} lineLength
 */
function drawLinearTicks(context,  color, ticks, minVal, maxVal,
                         hasLeft, hasRight, lineWidth, lineLength)
{
    let {isVertical, length, barWidth, barOffset, barMargin,
        pixelRatio, width, X, Y, ticksLength, ticksPadding} =
        context.barDimensions;
    let tickOffset = (width - barWidth) / 2;
    let tickX, tickY;
    let i = 0;
    let s = ticks.length;
    let val;
    let tickLen = lineLength * width;
    let tickLeft = tickOffset - ticksPadding * width;
    let tickRight = tickOffset + barWidth + tickLen + ticksPadding * width;
    let colors = color instanceof Array ?
        color : new Array(ticks.length).fill(color);

    context.lineWidth = lineWidth * pixelRatio;
    context.save();

    let ratio = ticksLength / (maxVal - minVal);
    for (; i < s; i++) {
        val = ticks[i];
        context.strokeStyle = colors[i];

        if (isVertical) {
            tickY = Y + length - barMargin - barOffset
                + (minVal - val) * ratio;

            if (hasLeft) {
                tickX = X + tickLeft;
                //noinspection JSUnresolvedFunction
                drawLinearTick(context, tickX, tickY, round(tickX - tickLen),
                    tickY);
            }

            if (hasRight) {
                tickX = X + tickRight;
                //noinspection JSUnresolvedFunction
                drawLinearTick(context, tickX, tickY, round(tickX - tickLen),
                    tickY);
            }
        }

        else {
            tickX = X + barMargin + barOffset
                - (minVal - val) * ratio;

            if (hasLeft) {
                tickY = Y + tickLeft;
                //noinspection JSUnresolvedFunction
                drawLinearTick(context, tickX, tickY, tickX,
                    round(tickY - tickLen));
            }

            if (hasRight) {
                tickY = Y + tickRight;
                //noinspection JSUnresolvedFunction
                drawLinearTick(context, tickX, round(tickY), tickX,
                    tickY - tickLen);
            }
        }
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws major ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearMajorTicks(context, options) {
    let [hasLeft, hasRight] = drawings.prepareTicks(options);
    let lineWidth = 2;
    let valuePerNonExactTick = (options.maxValue - options.minValue) /
        (options.majorTicks.length - 1);
    let colors = options.colorMajorTicks instanceof Array ?
        options.colorMajorTicks :
        new Array(options.majorTicks.length).fill(
            options.colorStrokeTicks || options.colorMajorTicks);
    let ticks = options.exactTicks ? options.majorTicks :
        options.majorTicks.map((tick, i) => {
            return options.minValue + valuePerNonExactTick * i;
        });

    drawLinearTicks(context, colors, ticks, options.minValue, options.maxValue,
        hasLeft, hasRight, lineWidth, options.ticksWidth / 100);

    if (options.strokeTicks) {
        let {isVertical, length, width, barWidth, barMargin, barOffset, X, Y,
            ticksLength, pixelRatio, ticksPadding} = context.barDimensions;
        let rightTicks = (width - barWidth) / 2 + barWidth +
            ticksPadding * width;
        let leftTicks = (width - barWidth) / 2 - ticksPadding * width;
        let sX, sY, eX, eY;

        context.strokeStyle = options.colorStrokeTicks || colors[0];

        lineWidth *= pixelRatio;

        if (isVertical) {
            sY = Y + length - barMargin - barOffset + lineWidth / 2;
            eY = sY - ticksLength - lineWidth;

            if (hasLeft) {
                //noinspection JSUnresolvedFunction
                eX = sX = round(X + leftTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }

            if (hasRight) {
                //noinspection JSUnresolvedFunction
                eX = sX = round(X + rightTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }
        }

        else {
            sX = X + barMargin + barOffset - lineWidth / 2;
            eX = sX + ticksLength + lineWidth;

            if (hasLeft) {
                //noinspection JSUnresolvedFunction
                eY = sY = round(Y + leftTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }

            if (hasRight) {
                //noinspection JSUnresolvedFunction
                eY = sY = round(Y + rightTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }
        }
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws ticks stroke
 *
 * @param {Canvas2DContext} context
 * @param {number} sX
 * @param {number} sY
 * @param {number} eX
 * @param {number} eY
 */
function drawLinearTickStroke(context, sX, sY, eX, eY) {
    context.beginPath();
    context.moveTo(sX, sY);
    context.lineTo(eX, eY);
    context.stroke();
    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws minor ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearMinorTicks(context, options) {
    let [hasLeft, hasRight] = drawings.prepareTicks(options);
    let ticks = [];
    let i = options.minValue;
    let minTicks = Math.abs(options.minorTicks) || 0;
    let valuePerNonExactTick = minTicks ?
        (options.maxValue - options.minValue) /
        (minTicks * (options.majorTicks.length - 1)) : 0;

    if (minTicks) {
        if (options.exactTicks) {
            let delta = BaseGauge.mod(options.majorTicks[0], minTicks) || 0;

            for (; i < options.maxValue; i += minTicks) {
                if ((delta+i) < options.maxValue) {
                    ticks.push(delta + i);
                }
            }
        }

        else {
            for (; i < options.maxValue; i += valuePerNonExactTick) {
                ticks.push(i);
            }
        }
    }

    drawLinearTicks(context,
        options.colorMinorTicks || options.colorStrokeTicks,
        ticks, options.minValue, options.maxValue,
        hasLeft, hasRight, 1, options.ticksWidthMinor / 100);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws major tick numbers
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearMajorTicksNumbers(context, options) {
    let {isVertical, length, width, barWidth,
        barMargin, barOffset, X, Y, ticksLength, ticksPadding} =
            context.barDimensions;
    let range = (options.maxValue - options.minValue);
    let valuePerNonExactTick = range /
        (options.majorTicks.length - 1);
    let tickValues = options.exactTicks ? options.majorTicks :
        options.majorTicks.map((tick, i) => {
            return options.minValue + valuePerNonExactTick * i;
        });
    let ticks = tickValues.length;
    let hasLeft = options.numberSide !== 'right';
    let hasRight = options.numberSide !== 'left';
    let textHeight = options.fontNumbersSize * width / 200;
    let i = 0;
    let ticksWidth = (options.ticksWidth / 100 + ticksPadding * 2) * width;
    let numLeft = (width - barWidth) / 2 - ticksWidth;
    let numRight = (width - barWidth) / 2 + barWidth + ticksWidth;
    let textX, textY, textWidth, numberOffset, tick;
    let colors = options.colorNumbers instanceof Array ?
        options.colorNumbers : new Array(ticks).fill(options.colorNumbers);
    let textMargin = options.numbersMargin / 100 * width;

    context.font = drawings.font(options, 'Numbers', width / 200);
    context.lineWidth = 0;
    context.textAlign = 'center';

    for (; i < ticks; i++) {
        context.fillStyle = colors[i];
        tick = options.majorTicks[i];
        numberOffset = options.exactTicks ?
            ticksLength * ((tickValues[i] - options.minValue) / range) :
            i * ticksLength / (ticks - 1);

        if (isVertical) {
            textY = Y + length - barMargin - barOffset - numberOffset
                + textHeight / 3;

            if (hasLeft) {
                context.textAlign = 'right';
                context.fillText(tick, X + numLeft - textMargin, textY);
            }

            if (hasRight) {
                context.textAlign = 'left';
                context.fillText(tick, X + numRight + textMargin, textY);
            }
        }

        else {
            textWidth = context.measureText(tick).width;
            textX = X + barMargin + barOffset + numberOffset;

            if (hasLeft) {
                context.fillText(tick, textX, Y + numLeft - textMargin);
            }

            if (hasRight) {
                context.fillText(tick, textX, Y + numRight + textHeight +
                    textMargin);
            }
        }
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge title
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearTitle(context, options) {
    if (!options.title) return ;

    let {isVertical, width, length, baseX, baseY, titleMargin} =
        context.barDimensions;
    let textHeight = options.fontTitleSize * width / 200;
    //noinspection JSUnresolvedFunction
    let textX = round(baseX + (isVertical ? width : length) / 2);
    //noinspection JSUnresolvedFunction
    let textY = round(baseY + titleMargin / 2 -
        (isVertical ? textHeight : textHeight / 2) -
        0.025 * (isVertical ? length : width));

    context.save();
    context.textAlign = 'center';
    context.fillStyle = options.colorTitle;
    context.font = drawings.font(options, 'Title', width / 200);
    context.lineWidth = 0;
    context.fillText(options.title, textX, textY, isVertical ? width : length);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge units
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearUnits(context, options) {
    if (!options.units) return ;

    let {isVertical, width, length, baseX, baseY, unitsMargin} =
        context.barDimensions;
    let textHeight = options.fontUnitsSize * width / 200;
    //noinspection JSUnresolvedFunction
    let textX = round(baseX + (isVertical ? width : length) / 2);
    //noinspection JSUnresolvedFunction
    let textY = round(baseY + (isVertical ? length : width) +
        unitsMargin / 2 - textHeight / 2);

    context.save();
    context.textAlign = 'center';
    context.fillStyle = options.colorUnits;
    context.font = drawings.font(options, 'Units', width / 200);
    context.lineWidth = 0;
    context.fillText(
        drawings.formatContext(options, options.units),
        textX,
        textY,
        isVertical ? width : length);
}

/* istanbul ignore next: private, not testable */
/**
 * Draws linear gauge needles
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearBarNeedle(context, options) {
    if (!options.needle) return;

    let {isVertical, width, length, barWidth, barOffset, barMargin,
        ticksLength, X, Y, ticksPadding} = context.barDimensions;
    let hasLeft = options.needleSide !== 'right';
    let hasRight = options.needleSide !== 'left';
    let position = ticksLength *
        (drawings.normalizedValue(options).indented - options.minValue) /
        (options.maxValue - options.minValue);
    let tickWidth = (options.ticksWidth / 100 + ticksPadding) * width;
    let baseLength = (barWidth / 2 + tickWidth);
    let needleLength = baseLength * (options.needleEnd / 100);
    let sX, eX, sY, eY;
    let draw = options.needleType.toLowerCase() === 'arrow' ?
        drawLinearArrowNeedle :
        drawLinearLineNeedle;
    let barStart = (width - barWidth) / 2;
    let needleStart = baseLength * (options.needleStart / 100);
    let nLeft = barStart - tickWidth - needleStart;
    let nRight = barStart + barWidth + tickWidth + needleStart;

    context.save();

    drawings.drawNeedleShadow(context, options);

    if (isVertical) {
        //noinspection JSUnresolvedFunction
        sY = round(Y + length - barMargin - barOffset - position);

        if (hasLeft) {
            //noinspection JSUnresolvedFunction
            sX = round(X + nLeft);
            eX = sX + needleLength;
            draw(context, options, sX, sY, eX, sY, needleLength);
        }

        if (hasRight) {
            //noinspection JSUnresolvedFunction
            sX = round(X + nRight);
            eX = sX - needleLength;
            draw(context, options, sX, sY, eX, sY, needleLength, true);
        }
    }

    else {
        //noinspection JSUnresolvedFunction
        sX = round(X + barMargin + barOffset + position);

        if (hasLeft) {
            //noinspection JSUnresolvedFunction
            sY = round(Y + nLeft);
            eY = sY + needleLength;
            draw(context, options, sX, sY, sX, eY, needleLength);
        }

        if (hasRight) {
            //noinspection JSUnresolvedFunction
            sY = round(Y + nRight);
            eY = sY - needleLength;
            draw(context, options, sX, sY, sX, eY, needleLength, true);
        }
    }

    context.restore();
}

/* istanbul ignore next: private, not testable */
/**
 * Returns needle color style
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} length
 * @param {boolean} [isRight]
 * @return {CanvasGradient|string}
 */
function needleStyle(context, options, length, isRight) {
    return options.colorNeedleEnd ?
        drawings.linearGradient(context,
            isRight ? options.colorNeedleEnd : options.colorNeedle,
            isRight ? options.colorNeedle : options.colorNeedleEnd,
            length,
            !context.barDimensions.isVertical
        ) : options.colorNeedle;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws line needle shape
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} sX
 * @param {number} sY
 * @param {number} eX
 * @param {number} eY
 * @param {number} length
 * @param {boolean} [isRight]
 */
function drawLinearLineNeedle(context, options, sX, sY, eX, eY, length,
                              isRight)
{
    context.lineWidth = options.needleWidth;
    context.strokeStyle = needleStyle(context, options, length, isRight);

    context.beginPath();
    context.moveTo(sX, sY);
    context.lineTo(eX, eY);
    context.stroke();
    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws arrow needle shape
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} sX
 * @param {number} sY
 * @param {number} eX
 * @param {number} eY
 * @param {number} length
 * @param {boolean} [isRight]
 */
function drawLinearArrowNeedle(context, options, sX, sY, eX, eY, length,
                               isRight)
{
    //noinspection JSUnresolvedFunction
    let peakLength = round(length * 0.4);
    let bodyLength = length - peakLength;
    let isVertical = sX === eX;
    let halfWidth = options.needleWidth / 2;

    context.fillStyle = needleStyle(context, options, length, isRight);

    context.beginPath();

    if (isVertical) {
        if (sY > eY) bodyLength *= -1;

        context.moveTo(sX - halfWidth, sY);
        context.lineTo(sX + halfWidth, sY);
        context.lineTo(sX + halfWidth, sY + bodyLength);
        context.lineTo(sX, eY);
        context.lineTo(sX - halfWidth, sY + bodyLength);
        context.lineTo(sX - halfWidth, sY);
    }

    else {
        if (sX > eX) bodyLength *= -1;

        context.moveTo(sX, sY - halfWidth);
        context.lineTo(sX, sY + halfWidth);
        context.lineTo(sX + bodyLength, sY + halfWidth);
        context.lineTo(eX, sY);
        context.lineTo(sX + bodyLength, sY - halfWidth);
        context.lineTo(sX, sY - halfWidth);
    }

    context.fill();
    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws value box for linear gauge
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 * @param {number} value
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawLinearValueBox(context, options, value, x, y, w, h) {
    // currently value box is available only for vertical linear gauge,
    // as far as by design it is hard to find a proper place for
    // horizontal ones
    let boxWidth = (parseFloat(options.fontValueSize) || 0) * w / 200;
    let dy = (0.11 * h - boxWidth) / 2;

    context.barDimensions.isVertical &&
    drawings.drawValueBox(context, options, value, x + w / 2,
        y + h - boxWidth - dy, w);
}

/**
 * Minimalistic HTML5 Canvas Linear Gauge
 */
export default class LinearGauge extends BaseGauge {

    /**
     * Fired each time before gauge plate is drawn
     *
     * @event LinearGauge#beforePlate
     */

    /**
     * Fired each time before gauge highlight areas are drawn
     *
     * @event LinearGauge#beforeHighlights
     */

    /**
     * Fired each time before gauge minor ticks are drawn
     *
     * @event LinearGauge#beforeMinorTicks
     */

    /**
     * Fired each time before gauge major ticks are drawn
     *
     * @event LinearGauge#beforeMajorTicks
     */

    /**
     * Fired each time before gauge tick numbers are drawn
     *
     * @event LinearGauge#beforeNumbers
     */

    /**
     * Fired each time before gauge title is drawn
     *
     * @event LinearGauge#beforeTitle
     */

    /**
     * Fired each time before gauge units text is drawn
     *
     * @event LinearGauge#beforeUnits
     */

    /**
     * Fired each time before gauge bar area is drawn
     *
     * @event LinearGauge#beforeBar
     */

    /**
     * Fired each time before gauge progress bar is drawn
     *
     * @event LinearGauge#beforeProgressBar
     */

    /**
     * Fired each time before gauge value box is drawn
     *
     * @event LinearGauge#beforeValueBox
     */

    /**
     * Fired each time before gauge needle is drawn
     *
     * @event LinearGauge#beforeNeedle
     */

    /**
     * @constructor
     * @param {LinearGaugeOptions} options
     */
    constructor(options) {
        options = Object.assign({}, defaultLinearGaugeOptions, options || {});
        super(LinearGauge.configure(options));
    }

    /**
     * Checks and updates gauge options properly
     *
     * @param {*} options
     * @return {*}
     * @access protected
     */
    static configure(options) {
        /* istanbul ignore else */
        if (options.barStrokeWidth >= options.barWidth) {
            //noinspection JSUnresolvedFunction
            options.barStrokeWidth = round(options.barWidth / 2);
        }

        //noinspection JSUndefinedPropertyAssignment
        options.hasLeft = hasTicksBar('right', options);
        //noinspection JSUndefinedPropertyAssignment
        options.hasRight = hasTicksBar('left', options);

        if (options.value > options.maxValue) {
            options.value = options.maxValue;
        }

        if (options.value < options.minValue) {
            options.value = options.minValue;
        }

        return BaseGauge.configure(options);
    }

    /* istanbul ignore next */
    /**
     * Triggering linear gauge render on a canvas.
     *
     * @returns {LinearGauge}
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

            if (!canvas.elementClone.initialized) {
                let context = canvas.contextClone;

                // clear the cache
                context.clearRect(x, y, w, h);
                context.save();

                this.emit('beforePlate');
                this.drawBox = drawLinearPlate(context, options, x, y, w, h);

                this.emit('beforeBar');
                drawLinearBar(context, options, ...this.drawBox);

                canvas.context.barDimensions = context.barDimensions;

                this.emit('beforeHighlights');
                drawLinearBarHighlights(context, options);
                this.emit('beforeMinorTicks');
                drawLinearMinorTicks(context, options);
                this.emit('beforeMajorTicks');
                drawLinearMajorTicks(context, options);
                this.emit('beforeNumbers');
                drawLinearMajorTicksNumbers(context, options);
                this.emit('beforeTitle');
                drawLinearTitle(context, options);
                this.emit('beforeUnits');
                drawLinearUnits(context, options);

                canvas.elementClone.initialized = true;
            }

            this.canvas.commit();

            // clear the canvas
            canvas.context.clearRect(x, y, w, h);
            canvas.context.save();

            canvas.context.drawImage(canvas.elementClone, x, y, w, h);
            canvas.context.save();

            this.emit('beforeProgressBar');
            drawLinearBarProgress(canvas.context, options, ...this.drawBox);
            this.emit('beforeNeedle');
            drawLinearBarNeedle(canvas.context, options);
            this.emit('beforeValueBox');
            drawLinearValueBox(canvas.context, options, options.animatedValue ?
                this.options.value : this.value, ...this.drawBox);

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
    ns['LinearGauge'] = LinearGauge;
}

BaseGauge.initialize('LinearGauge', defaultLinearGaugeOptions);

module.exports = LinearGauge;
