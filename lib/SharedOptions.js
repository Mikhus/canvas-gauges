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

const SharedOptions = {
    // basic options
    renderTo: null,
    width: 200,
    height: 200,
    minValue: 0,
    maxvalue: 100,
    value: 0,
    units: false,
    majorTicks: [],
    minorTicks: 10,
    strokeTicks: true,
    updateValueOnAnimation: false,
    glow: true,
    title: false,

    // number formats
    valueInt: 3,
    valueDec: 2,
    majorTicksInt: 1,
    majorTicksDec: 0,

    // animations
    animation: true,
    animationDuration: 250,
    animationRule: 'cycle',

    // colors
    colorPlate: '#fff',
    colorMajorTicks: '#444',
    colorMinorTicks: '#666',
    colorTitle: '#888',
    colorUnits: '#888',
    colorNumbers: '#444',
    colorNeedleStart: 'rgba(240,128,128,1)',
    colorNeedleEnd: 'rgba(255,160,122,.9)',
    colorValueText: '#444',
    colorValueTextShadow: 'rgba(0,0,0,0.3)',
    colorBorderShadow: 'rgba(0,0,0,0.5)',
    colorBorderOuterStart: '#ddd',
    colorBorderOuterEnd: '#aaa',
    colorBorderMiddleStart: '#eee',
    colorBorderMiddleEnd: '#f0f0f0',
    colorBorderInnerStart: '#fafafa',
    colorBorderInnerEnd: '#ccc',

    // needle
    needle: true,
    needleShadow: true,
    needleType: 'arrow',

    // borders
    borders: true,
    borderOuter: true,
    borderOuterWidth: 3,
    borderMiddle: true,
    borderMiddleWidth: 3,
    borderInner: true,
    borderInnerWidth: 3,
    borderShadowWidth: 3,

    // value and highlights
    valueBox: true,
    valueText: true,
    highlights: [
        { from: 20, to: 60, color: '#eee' },
        { from: 60, to: 80, color: '#ccc' },
        { from: 80, to: 100, color: '#999' }]
};

export default SharedOptions;

module.exports = SharedOptions;
