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
 * @typedef {GenericOptions|{borderRadius: number, barBeginCircle: number, barWidth: number, barStrokeWidth: number, barProgress: boolean, colorBar: string, colorBarEnd: string, colorBarStroke: string, colorBarProgress: string, colorBarProgressEnd: string, tickSide: string, needleSide: string, numberSide: string, ticksWidth: number, ticksWidthMinor: number, ticksPadding: number, barLength: number}} LinearGaugeOptions
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
    barWidth: 20, // percents
    barStrokeWidth: 0, // pixels
    barProgress: true,

    colorBarStroke: '#222',
    colorBar: '#ccc',
    colorBarEnd: '',
    colorBarProgress: '#888',
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
    context.save();

    let r = options.borderRadius;
    let w1 = w - options.borderShadowWidth - options.borderOuterWidth;
    let w2 = w1 - options.borderOuterWidth - options.borderMiddleWidth;
    let w3 = w2 - options.borderMiddleWidth - options.borderInnerWidth;
    let w4 = w3 - options.borderInnerWidth;

    let h1 = h - options.borderShadowWidth - options.borderOuterWidth;
    let h2 = h1 - options.borderOuterWidth - options.borderMiddleWidth;
    let h3 = h2 - options.borderMiddleWidth - options.borderInnerWidth;
    let h4 = h3 - options.borderInnerWidth;

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
        drawLinearBorder(context, options.borderOuterWidth,
            r,
            x + options.borderOuterWidth / 2 - aliasingOffset,
            y + options.borderOuterWidth / 2 - aliasingOffset,
            w1, h1,
            options.colorBorderOuter,
            options.colorBorderOuterEnd);
        aliasingOffset += .5;
    }

    if (options.borderMiddleWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawLinearBorder(context, options.borderMiddleWidth,
            (r -= 1 + aliasingOffset * 2),
            x2 + options.borderMiddleWidth / 2 - aliasingOffset,
            y2 + options.borderMiddleWidth / 2 - aliasingOffset,
            w2 + aliasingOffset * 2,
            h2 + aliasingOffset * 2,
            options.colorBorderMiddle,
            options.colorBorderMiddleEnd);
        aliasingOffset += .5;
    }

    if (options.borderInnerWidth) {
        shadowDrawn = drawings.drawShadow(context, options, shadowDrawn);
        drawLinearBorder(context,options.borderInnerWidth,
            (r -= 1 + aliasingOffset * 2),
            x3 + options.borderInnerWidth / 2 - aliasingOffset,
            y3 + options.borderInnerWidth / 2 - aliasingOffset,
            w3 + aliasingOffset * 2,
            h3 + aliasingOffset * 2,
            options.colorBorderInner,
            options.colorBorderInnerEnd);
        aliasingOffset += .5;
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
    let width = isVertical ? w * .85 : h;
    let length = isVertical ? h : w;

    x = isVertical ? round(x + (w - width) / 2) : x;

    let hasTitle = !!options.title;
    let hasUnits = !!options.units;
    let hasValue = !!options.valueBox;

    let titleMargin;
    let unitsMargin;
    let valueMargin;

    if (isVertical) {
        unitsMargin = round(length * .05);
        titleMargin = round(length * .075);
        valueMargin = round(length * .075);

        if (hasTitle) {
            length -= titleMargin;
            y += titleMargin;
        }

        if (hasUnits) length -= unitsMargin;
        if (hasValue) length -= valueMargin;
    }

    else {
        unitsMargin = titleMargin = round(width * .15);

        if (hasTitle) {
            width -= titleMargin;
            y += titleMargin;
        }

        if (hasUnits) width -= unitsMargin;
    }

    let strokeWidth = options.barStrokeWidth * 2;
    let radius = options.barBeginCircle ?
        round(width * options.barBeginCircle / 200 - strokeWidth / 2) : 0;

    let barWidth = round(width * options.barWidth / 100 - strokeWidth);
    let barLength = round(length * options.barLength / 100 - strokeWidth);
    let barMargin = round((length - barLength) / 2);

    // coordinates for arc of the bar if configured
    let x0 = round(x + (isVertical ? width / 2 : barMargin + radius));
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
        let cutRadius = isVertical ? abs(y1 - y0) : abs(x1 - x0);

        context.barDimensions.barOffset = round(cutRadius + radius);

        // bottom point
        let x2 = isVertical ? round(x0 - radius * sinAlpha) : x1;
        let y2 = isVertical ? y1 : round(y0 - radius * sinAlpha);

        if (type === 'progress') {
            barLength = context.barDimensions.barOffset +
                (barLength - context.barDimensions.barOffset) *
                (options.value - options.minValue) /
                (options.maxValue - options.minValue);
        }

        // bar ends at
        let x3 = round(x1 + barLength - context.barDimensions.barOffset +
            strokeWidth / 2); // h
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
        let rx = round(isVertical ?
            (X +  (width - barWidth) / 2) : (X + barMargin));
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
    let eX = round(isVertical ? X + tickOffset : X + barMargin + barOffset);
    let eH = hlWidth;
    let eY = isVertical ? Y + length - barMargin - barOffset: Y + tickOffset;
    let hLeft = round((options.ticksWidth / 100 + ticksPadding) * width)
        + (hlWidth - options.ticksWidth / 100 * width);
    let hRight = round(barWidth + ticksPadding * width);

    context.save();

    for (; i < s; i++) {
        let entry = options.highlights[i];
        let eStart = ticksLength * abs(entry.from) / interval;
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
 * @param {number} ticksSize
 * @param {number} deltaLen
 * @param {boolean} hasLeft
 * @param {boolean} hasRight
 * @param {number} lineWidth
 * @param {number} lineLength
 */
function drawLinearTicks(context,  color, ticksSize, deltaLen,
                         hasLeft, hasRight, lineWidth, lineLength)
{
    let {isVertical, length, barWidth, barOffset, barMargin,
        pixelRatio, width, X, Y, ticksLength, ticksPadding} =
            context.barDimensions;
    let tickOffset = (width - barWidth) / 2;
    let tickX, tickY;
    let i = 0;
    let tickLen = lineLength * width;
    let tickLeft = tickOffset - ticksPadding * width;
    let tickRight = tickOffset + barWidth + tickLen + ticksPadding * width;
    let tickSpace = ticksLength / (ticksSize - deltaLen);
    let colors = color instanceof Array ? color : Array(ticksSize).fill(color);

    context.lineWidth = lineWidth * pixelRatio;
    context.save();

    for (; i < ticksSize; i++) {
        context.strokeStyle = colors[i];

        if (isVertical) {
            tickY = Y + length - barMargin - barOffset - i * tickSpace;

            if (hasLeft) {
                tickX = X + tickLeft;
                drawLinearTick(context, tickX, tickY, round(tickX - tickLen),
                    tickY);
            }

            if (hasRight) {
                tickX = X + tickRight;
                drawLinearTick(context, tickX, tickY, round(tickX - tickLen),
                    tickY);
            }
        }

        else {
            tickX = X + barMargin + barOffset + i * tickSpace;

            if (hasLeft) {
                tickY = Y + tickLeft;
                drawLinearTick(context, tickX, tickY, tickX,
                    round(tickY - tickLen));
            }

            if (hasRight) {
                tickY = Y + tickRight;
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
    let colors = options.colorMajorTicks instanceof Array ?
        options.colorMajorTicks :
        Array(options.colorMajorTicks.length).fill(options.colorMajorTicks);

    drawLinearTicks(context, options.colorMajorTicks, options.majorTicks.length,
        1, hasLeft, hasRight, lineWidth, options.ticksWidth / 100);

    if (options.strokeTicks) {
        let {isVertical, length, width, barWidth, barMargin, barOffset, X, Y,
            ticksLength, pixelRatio, ticksPadding} = context.barDimensions;
        let rightTicks = (width - barWidth) / 2 + barWidth +
            ticksPadding * width;
        let leftTicks = (width - barWidth) / 2 - ticksPadding * width;
        let sX, sY, eX, eY;

        context.strokeStyle = colors[0];

        lineWidth *= pixelRatio;

        if (isVertical) {
            sY = Y + length - barMargin - barOffset + lineWidth / 2;
            eY = sY - ticksLength - lineWidth;

            if (hasLeft) {
                eX = sX = round(X + leftTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }

            if (hasRight) {
                eX = sX = round(X + rightTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }
        }

        else {
            sX = X + barMargin + barOffset - lineWidth / 2;
            eX = sX + ticksLength + lineWidth;

            if (hasLeft) {
                eY = sY = round(Y + leftTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }

            if (hasRight) {
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

    drawLinearTicks(context, options.colorMinorTicks,
        options.minorTicks * (options.majorTicks.length - 1), 0,
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
    let ticks = options.majorTicks.length;
    let hasLeft = options.numberSide !== 'right';
    let hasRight = options.numberSide !== 'left';
    let textHeight = options.fontNumbersSize * width / 200;
    let i = 0;
    let ticksWidth = (options.ticksWidth / 100 + ticksPadding * 2) * width;
    let numLeft = (width - barWidth) / 2 - ticksWidth;
    let numRight = (width - barWidth) / 2 + barWidth + ticksWidth;
    let textX, textY, textWidth, numberOffset, tick;
    let colors = options.colorNumbers instanceof Array ?
        options.colorNumbers : Array(ticks).fill(options.colorNumbers);

    context.font = options.fontNumbersStyle + ' ' +
        options.fontNumbersWeight + ' ' +
        textHeight + 'px ' +
        options.fontNumbers;
    context.lineWidth = 0;
    context.textAlign = 'center';

    for (; i < ticks; i++) {
        context.fillStyle = colors[i];
        tick = options.majorTicks[i];
        numberOffset = i * ticksLength / (ticks - 1);

        if (isVertical) {
            textY = Y + length - barMargin - barOffset - numberOffset
                + textHeight / 3;

            if (hasLeft) {
                context.textAlign = 'right';
                context.fillText(tick, X + numLeft, textY);
            }

            if (hasRight) {
                context.textAlign = 'left';
                context.fillText(tick, X + numRight, textY);
            }
        }

        else {
            textWidth = context.measureText(tick).width;
            textX = X + barMargin + barOffset + numberOffset;

            if (hasLeft) {
                context.fillText(tick, textX, Y + numLeft);
            }

            if (hasRight) {
                context.fillText(tick, textX, Y + numRight + textHeight);
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
    let textX = round(baseX + (isVertical ? width : length) / 2);
    let textY = round(baseY + titleMargin / 2 -
        (isVertical ? textHeight : textHeight / 2) -
        .025 * (isVertical ? length : width));

    context.save();
    context.textAlign = 'center';
    context.fillStyle = options.colorTitle;
    context.font = options.fontTitleStyle + ' ' +
        options.fontTitleWeight + ' ' +
        textHeight + 'px ' +
        options.fontTitle;
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
    let textX = round(baseX + (isVertical ? width : length) / 2);
    let textY = round(baseY + (isVertical ? length : width) +
        unitsMargin / 2 - textHeight / 2);

    context.save();
    context.textAlign = 'center';
    context.fillStyle = options.colorTitle;
    context.font = options.fontUnitsStyle + ' ' +
        options.fontUnitsWeight + ' ' +
        textHeight + 'px ' +
        options.fontUnits;
    context.lineWidth = 0;
    context.fillText(options.units, textX, textY, isVertical ? width : length);
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
        (options.value - options.minValue) /
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
        sY = round(Y + length - barMargin - barOffset - position);

        if (hasLeft) {
            sX = round(X + nLeft);
            eX = sX + needleLength;
            draw(context, options, sX, sY, eX, sY, needleLength);
        }

        if (hasRight) {
            sX = round(X + nRight);
            eX = sX - needleLength;
            draw(context, options, sX, sY, eX, sY, needleLength, true);
        }
    }

    else {
        sX = round(X + barMargin + barOffset + position);

        if (hasLeft) {
            sY = round(Y + nLeft);
            eY = sY + needleLength;
            draw(context, options, sX, sY, sX, eY, needleLength);
        }

        if (hasRight) {
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
    let peakLength = round(length *.4);
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
    context.barDimensions.isVertical &&
    drawings.drawValueBox(context, options, value, x + w / 2,
        y + h - (40 * (w / 300)), w);
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
        options = Object.assign({}, defaultLinearGaugeOptions, options || {});

        /* istanbul ignore else */
        if (options.barStrokeWidth >= options.barWidth) {
            options.barStrokeWidth = round(options.barWidth / 2);
        }

        //noinspection JSUndefinedPropertyAssignment
        options.hasLeft = hasTicksBar('right', options);
        //noinspection JSUndefinedPropertyAssignment
        options.hasRight = hasTicksBar('left', options);

        super(options);
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

                this.drawBox = drawLinearPlate(context, options, x, y, w, h);

                drawLinearBar(context, options, ...this.drawBox);

                canvas.context.barDimensions = context.barDimensions;

                drawLinearBarHighlights(context, options);
                drawLinearMinorTicks(context, options);
                drawLinearMajorTicks(context, options);
                drawLinearMajorTicksNumbers(context, options);
                drawLinearTitle(context, options);
                drawLinearUnits(context, options);

                canvas.elementClone.initialized = true;
            }

            this.canvas.commit();

            // clear the canvas
            canvas.context.clearRect(x, y, w, h);
            canvas.context.save();

            canvas.context.drawImage(canvas.elementClone, x, y, w, h);
            canvas.context.save();

            drawLinearBarProgress(canvas.context, options, ...this.drawBox);
            drawLinearBarNeedle(canvas.context, options);
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
