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

    colorBarStroke: '#222',
    colorBar: '#ccc',
    colorBarEnd: '',
    colorBarProgress: '#888',
    colorBarProgressEnd: '',

    needleWidth: 6,

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
 * @param {LinearGaugeOptions|{barStrokeWidth: number, barBeginCircle: number, barWidth: number}} options
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @return {{isVertical: boolean, width: number, length: number, barWidth: number, barLength: number, strokeWidth: number, barMargin: number, radius: number, x0: number, y0: number, barOffset: number, titleMargin: number, unitsMargin: number, X: number, Y: number}}
 */
function barDimensions(context, options, x, y, w, h) {
    let pixelRatio = SmartCanvas.pixelRatio;
    let isVertical = h >= w;
    let width = isVertical ? w * .85 : h;
    let length = isVertical ? h : w;

    x = isVertical ? Math.round(x + (w - width) / 2) : x;

    let hasTitle = !!options.title;
    let hasUnits = !!options.units;

    let titleMargin;
    let unitsMargin;

    if (isVertical) {
        unitsMargin = titleMargin = Math.round(length * .1);

        if (hasTitle) {
            length -= titleMargin;
            y += titleMargin;
        }

        if (hasUnits) length -= unitsMargin;
    }

    else {
        unitsMargin = titleMargin = Math.round(width * .15);

        if (hasTitle) {
            width -= titleMargin;
            y += titleMargin;
        }

        if (hasUnits) width -= unitsMargin;
    }

    let strokeWidth = options.barStrokeWidth * 2;
    let radius = options.barBeginCircle ?
        Math.round(width * options.barBeginCircle / 200 - strokeWidth / 2) : 0;

    let barWidth = Math.round(width * options.barWidth / 100 - strokeWidth);
    let barLength = Math.round(length * .85 - strokeWidth);
    let barMargin = Math.round((length - barLength) / 2);

    // coordinates for arc of the bar if configured
    let x0 = Math.round(x + (
        isVertical ?
            width / 2 :
            barMargin + radius));
    let y0 = Math.round(y + (
        isVertical ?
            length - barMargin - radius + strokeWidth / 2:
            width / 2));

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
        X: x,
        Y: y,
        x0: x0,
        y0: y0
    };

    return context.barDimensions;
}


/* istanbul ignore next: private, not testable */
/**
 * Draws bar shape from the given options on a given canvas context
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
 * @param {string} title
 * @param {string} units
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawLinearBarShape(context, barOpWidth, barStrokeWidth, strokeColor,
                            circleRadius, colorStart, colorEnd, toValue,
                            minValue, maxValue, title, units, x, y, w, h)
{
    let {isVertical, width, barWidth, barLength, strokeWidth,
        barMargin, radius, x0, y0, X, Y} =
        barDimensions(context, {
            barStrokeWidth: barStrokeWidth,
            barBeginCircle: circleRadius,
            barWidth: barOpWidth,
            title: title,
            units: units
        }, x, y, w, h);

    context.save();
    context.beginPath();

    if (circleRadius) {
        let direction = drawings.radians(isVertical ? 270 : 0);
        let alpha = Math.asin(barWidth / 2 / radius);
        let cosAlpha = Math.cos(alpha);
        let sinAlpha = Math.sin(alpha);

        let x1 = Math.round(x0 + (isVertical ?
            radius * sinAlpha :
            radius * cosAlpha - strokeWidth / 2));
        let y1 = Math.round(isVertical ?
            y0 - radius * cosAlpha:
            y0 + radius * sinAlpha);
        let cutRadius = isVertical ? Math.abs(y1 - y0) : Math.abs(x1 - x0);
        // let radiusOffset = Math.round(radius - cutRadius);
        //
        // if (isVertical) {
        //     y0 -= radiusOffset;
        //     y1 -= radiusOffset;
        // }
        //
        // else {
        //     x0 -= radiusOffset;
        //     x1 -= radiusOffset;
        // }
        // barLength -= radiusOffset;

        context.barDimensions.barOffset = Math.round(cutRadius + radius);

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
            (X +  (width - barWidth) / 2) : (X + barMargin));
        let ry = Math.round(isVertical ?
            (Y + barLength + barMargin) : (Y +  (width - barWidth) / 2));

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
    if (circleRadius)
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
        options.title,
        options.units,
        x, y, w, h);
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
        options.title,
        options.units,
        x, y, w, h);
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
        X, Y, ticksLength} = context.barDimensions;

    if (!options.highlights) return ;

    let hasLeft = options.tickSide !== 'right';
    let hasRight = options.tickSide !== 'left';
    let i = 0;
    let s = options.highlights.length;
    let tickOffset = (width - barWidth) / 2;
    let interval = options.maxValue - options.minValue;
    let eX = isVertical ? X + tickOffset : X + barMargin + barOffset;
    let eH = .1 * width;
    let eY = isVertical ? Y + length - barMargin - barOffset: Y + tickOffset;

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
        pixelRatio, width, X, Y, ticksLength} = context.barDimensions;
    let tickOffset = (width - barWidth) / 2;
    let tickX, tickY, tickWidth, tickHeight;
    let i = 0;

    context.lineWidth = lineWidth * pixelRatio;
    context.strokeStyle = color;
    context.save();

    for (; i < ticksSize; i++) {
        if (isVertical) {
            tickWidth = lineLength * width;
            tickY = Y + length - barMargin - barOffset -
                i * ticksLength / (ticksSize - deltaLen);

            if (hasLeft) {
                tickX = X + tickOffset - .05 * width;
                drawLinearTick(context, tickX, tickY, tickX - tickWidth, tickY);
            }

            if (hasRight) {
                tickX = X + tickOffset + barWidth + tickWidth + .05 * width;
                drawLinearTick(context, tickX, tickY, tickX - tickWidth, tickY);
            }
        }

        else {
            tickHeight = lineLength * width;
            tickX = X + barMargin + barOffset +
                i * ticksLength / (ticksSize - deltaLen);

            if (hasLeft) {
                tickY = Y + tickOffset - .05 * width;
                drawLinearTick(context, tickX, tickY, tickX,
                    tickY - tickHeight);
            }

            if (hasRight) {
                tickY = Y + tickOffset + barWidth + tickHeight + .05 * width;
                drawLinearTick(context, tickX, tickY, tickX,
                    tickY - tickHeight);
            }
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
 * Draws major ticks
 *
 * @param {Canvas2DContext} context
 * @param {LinearGaugeOptions} options
 */
function drawLinearMajorTicks(context, options) {
    let [hasLeft, hasRight] = prepareTicks(options);
    let lineWidth = 2;

    drawLinearTicks(context, options.colorMajorTicks,
        options.majorTicks.length, 1, hasLeft, hasRight, lineWidth, .1);

    if (options.strokeTicks) {
        let {isVertical, length, width, barWidth, barMargin, barOffset, X, Y,
            ticksLength, pixelRatio} = context.barDimensions;
        let rightTicks = (width - barWidth) / 2 + barWidth + .05 * width;
        let leftTicks = (width - barWidth) / 2 - .05 * width;
        let sX, sY, eX, eY;

        lineWidth *= pixelRatio;

        if (isVertical) {
            sY = Y + length - barMargin - barOffset + lineWidth / 2;
            eY = sY - ticksLength - lineWidth;

            if (hasLeft) {
                eX = sX = Math.round(X + leftTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }

            if (hasRight) {
                eX = sX = Math.round(X + rightTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }
        }

        else {
            sX = X + barMargin + barOffset - lineWidth / 2;
            eX = sX + ticksLength + lineWidth;

            if (hasLeft) {
                eY = sY = Math.round(Y + leftTicks);
                drawLinearTickStroke(context, sX, sY, eX, eY);
            }

            if (hasRight) {
                eY = sY = Math.round(Y + rightTicks);
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
    let [hasLeft, hasRight] = prepareTicks(options);

    drawLinearTicks(context, options.colorMajorTicks,
        options.minorTicks * (options.majorTicks.length - 1), 0,
        hasLeft, hasRight, 1, .05);
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
        barMargin, barOffset, X, Y, ticksLength} = context.barDimensions;
    let ticks = options.majorTicks.length;
    let hasLeft = options.numberSide !== 'right';
    let hasRight = options.numberSide !== 'left';
    let textHeight = 20 * width / 200;
    let i = 0;
    let textX, textY, textWidth, numberOffset, tick;

    context.font = textHeight + 'px Arial';
    context.fillStyle = options.colorNumbers;
    context.lineWidth = 0;
    context.textAlign = 'center';

    for (; i < ticks; i++) {
        tick = options.majorTicks[i];
        numberOffset = i * ticksLength / (ticks - 1);

        if (isVertical) {
            textY = Y + length - barMargin - barOffset - numberOffset
                + textHeight / 3;

            if (hasLeft) {
                context.textAlign = 'right';
                context.fillText(tick, Math.round(X + (width - barWidth) / 2 -
                    .2 * width), textY);
            }

            if (hasRight) {
                context.textAlign = 'left';
                context.fillText(tick, Math.round(X + (width - barWidth) / 2 +
                    barWidth + .2 * width), textY);
            }
        }

        else {
            textWidth = context.measureText(tick).width;
            textX = X + barMargin + barOffset + numberOffset;

            if (hasLeft) {
                context.fillText(tick, textX,
                    Y + (width - barWidth) / 2 - .2 * width);
            }

            if (hasRight) {
                context.fillText(tick, textX, Y + (width - barWidth) / 2 +
                    barWidth + .2 * width + textHeight);
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

    let {isVertical, width, length, X, Y, titleMargin} = context.barDimensions;
    let textHeight = .125 * width;
    let textX = Math.round(X + (isVertical ? width : length) / 2);
    let textY = Math.round(Y + titleMargin / 2 -
        (isVertical ? textHeight : textHeight / 2) -
        .025 * (isVertical ? length : width));

    context.save();
    context.textAlign = 'center';
    context.fillStyle = options.colorTitle;
    context.font = textHeight + 'px Arial';
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

    let {isVertical, width, length, X, Y, unitsMargin} = context.barDimensions;
    let textHeight = .125 * width;
    let textX = Math.round(X + (isVertical ? width : length) / 2);
    let textY = Math.round(Y + (isVertical ? length : width) +
        unitsMargin / 2 - textHeight / 2 -
        .025 * (isVertical ? length : width));

    context.save();
    context.textAlign = 'center';
    context.fillStyle = options.colorTitle;
    context.font = textHeight + 'px Arial';
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
        ticksLength, X, Y} = context.barDimensions;
    let hasLeft = options.needleSide !== 'right';
    let hasRight = options.needleSide !== 'left';
    let position = ticksLength *
        options.value / (options.maxValue - options.minValue);
    let baseLength = (barWidth / 2 + .15 * width);
    let needleLength = baseLength * (options.needleEnd / 100);
    let sX, eX, sY, eY;
    let draw = options.needleType.toLowerCase() === 'arrow' ?
        drawLinearArrowNeedle :
        drawLinearLineNeedle;

    drawings.drawNeedleShadow(context, options);

    context.save();

    if (isVertical) {
        sY = Math.round(Y + length - barMargin - barOffset - position);

        if (hasLeft) {
            sX = Math.round(X + (width - barWidth) / 2 - .15 * width -
                baseLength * (options.needleStart / 100));
            eX = sX + needleLength;
            draw(context, options, sX, sY, eX, sY, needleLength);
        }

        if (hasRight) {
            sX = Math.round(X + (width - barWidth) / 2 + barWidth +
                .15 * width + baseLength * (options.needleStart / 100));
            eX = sX - needleLength;
            draw(context, options, sX, sY, eX, sY, needleLength);
        }
    }

    else {
        sX = Math.round(X + barMargin + barOffset + position);

        if (hasLeft) {
            sY = Math.round(Y + (width - barWidth) / 2 - .15 * width -
                baseLength * (options.needleStart / 100));
            eY = sY + needleLength;
            draw(context, options, sX, sY, sX, eY, needleLength);
        }

        if (hasRight) {
            sY = Math.round(Y + (width - barWidth) / 2 + barWidth +
                .15 * width + baseLength * (options.needleStart / 100));
            eY = sY - needleLength;
            draw(context, options, sX, sY, sX, eY, needleLength);
        }
    }
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
 */
function drawLinearLineNeedle(context, options, sX, sY, eX, eY, length) {
    context.lineWidth = width;
    context.strokeStyle = options.colorNeedleEnd ?
        drawings.linearGradient(context, options.colorNeedleStart,
            options.colorNeedleEnd, length) :
        options.colorNeedleStart;

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
 */
function drawLinearArrowNeedle(context, options, sX, sY, eX, eY, length) {
    let peakLength = Math.round(length *.4);
    let bodyLength = length - peakLength;
    let isVertical = sX === eX;
    let halfWidth = options.needleWidth / 2;

    context.fillStyle = options.colorNeedleEnd ?
        drawings.linearGradient(context, options.colorNeedleStart,
            options.colorNeedleEnd, length) :
        options.colorNeedleStart;

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

        /* istanbul ignore else */
        if (options.barStrokeWidth >= options.barWidth) {
            options.barStrokeWidth = Math.round(options.barWidth / 2);
        }

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

        return this;
    }

}

window['LinearGauge'] = LinearGauge;

BaseGauge.initialize('LinearGauge', defaultLinearGaugeOptions);

module.exports = LinearGauge;
