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
 * Shared generic gauges options
 *
 * @type {{renderTo: RenderTarget, width: number, height: number, minValue: number, maxValue: number, value: number, units: string|boolean, majorTicks: number[]|string[], exactTicks: boolean, minorTicks: number, strokeTicks: boolean, animatedValue: boolean, animateOnInit: boolean, title: string|boolean, borders: boolean, valueInt: number, valueDec: number, majorTicksInt: number, majorTicksDec: number, animation: boolean, animationDuration: number, animationRule: string|AnimationRule, colorPlate: string, colorPlateEnd: string, colorMajorTicks: string, colorMinorTicks: string, colorStrokeTicks: string, colorTitle: string, colorUnits: string, colorNumbers: string, colorNeedle: string, colorNeedleEnd: string, colorValueText: string, colorValueTextShadow: string, colorBorderShadow: string, colorBorderOuter: string, colorBorderOuterEnd: string, colorBorderMiddle: string, colorBorderMiddleEnd: string, colorBorderInner: string, colorBorderInnerEnd: string, colorValueBoxRect: string, colorValueBoxRectEnd: string, colorValueBoxBackground: string, colorValueBoxShadow: string, colorNeedleShadowUp: string, colorNeedleShadowDown: string, needle: boolean, needleShadow: boolean, needleType: string, needleStart: number, needleEnd: number, needleWidth: number, borderOuterWidth: number, borderMiddleWidth: number, borderInnerWidth: number, borderShadowWidth: number, valueBox: boolean, valueBoxWidth: number, valueBoxStroke: number, valueText: string, valueTextShadow: boolean, valueBoxBorderRadius: number, highlights: Highlight[], highlightsWidth: number, fontNumbers: string, fontTitle: string, fontUnits: string, fontValue: string, fontTitleSize: number, fontValueSize: number, fontUnitsSize: number, fontNumbersSize: number, fontNumbersStyle: string, fontTitleStyle: string, fontUnitsStyle: string, fontValueStyle: string, fontNumbersWeight: string, fontTitleWeight: string, fontUnitsWeight: string, fontValueWeight: string, barWidth: number, barStrokeWidth: number, barProgress: boolean, colorBar: string, colorBarStroke: string, colorBarProgress: string, colorBarShadow: string, barShadow: number, listeners: object}} GenericOptions
 */
const GenericOptions = {
    // basic options
    renderTo: null,
    width: 0,
    height: 0,
    minValue: 0,
    maxValue: 100,
    value: 0,
    units: false,
    exactTicks: false,
    majorTicks: [0, 20, 40, 60, 80, 100],
    minorTicks: 10,
    strokeTicks: true,
    animatedValue: false,
    animateOnInit: false,
    title: false,
    borders: true,
    numbersMargin: 1,

    listeners: null,

    // number formats
    valueInt: 3,
    valueDec: 2,
    majorTicksInt: 1,
    majorTicksDec: 0,

    // animations
    animation: true,
    animationDuration: 500,
    animationRule: 'cycle',

    // colors
    colorPlate: '#fff',
    colorPlateEnd: '',
    colorMajorTicks: '#444',
    colorMinorTicks: '#666',
    colorStrokeTicks: '',
    colorTitle: '#888',
    colorUnits: '#888',
    colorNumbers: '#444',
    colorNeedle: 'rgba(240,128,128,1)',
    colorNeedleEnd: 'rgba(255,160,122,.9)',
    colorValueText: '#444',
    colorValueTextShadow: 'rgba(0,0,0,0.3)',
    colorBorderShadow: 'rgba(0,0,0,0.5)',
    colorBorderOuter: '#ddd',
    colorBorderOuterEnd: '#aaa',
    colorBorderMiddle: '#eee',
    colorBorderMiddleEnd: '#f0f0f0',
    colorBorderInner: '#fafafa',
    colorBorderInnerEnd: '#ccc',
    colorValueBoxRect: '#888',
    colorValueBoxRectEnd: '#666',
    colorValueBoxBackground: '#babab2',
    colorValueBoxShadow: 'rgba(0,0,0,1)',
    colorNeedleShadowUp: 'rgba(2,255,255,0.2)',
    colorNeedleShadowDown: 'rgba(188,143,143,0.45)',
    colorBarStroke: '#222',
    colorBar: '#ccc',
    colorBarProgress: '#888',
    colorBarShadow: '#000',

    fontNumbers: 'Arial',
    fontTitle: 'Arial',
    fontUnits: 'Arial',
    fontValue: 'Arial',

    fontNumbersSize: 20,
    fontTitleSize: 24,
    fontUnitsSize: 22,
    fontValueSize: 26,

    fontNumbersStyle: 'normal',
    fontTitleStyle: 'normal',
    fontUnitsStyle: 'normal',
    fontValueStyle: 'normal',

    fontNumbersWeight: 'normal',
    fontTitleWeight: 'normal',
    fontUnitsWeight: 'normal',
    fontValueWeight: 'normal',

    // needle
    needle: true,
    needleShadow: true,
    needleType: 'arrow',
    needleStart: 5,
    needleEnd: 85,
    needleWidth: 4,

    // borders
    borderOuterWidth: 3,
    borderMiddleWidth: 3,
    borderInnerWidth: 3,
    borderShadowWidth: 3,

    // value and highlights
    valueBox: true,
    valueBoxStroke: 5,
    valueBoxWidth: 0,
    valueText: '',
    valueTextShadow: true,
    valueBoxBorderRadius: 2.5,

    // highlights
    highlights: [
        { from: 20, to: 60, color: '#eee' },
        { from: 60, to: 80, color: '#ccc' },
        { from: 80, to: 100, color: '#999' }],
    highlightsWidth: 15,
    highlightsLineCap: 'butt',

    // progress bar
    barWidth: 20, // percents
    barStrokeWidth: 0, // pixels
    barProgress: true,
    barShadow: 0
};

export default GenericOptions;

module.exports = GenericOptions;
