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
 * Look-ups for a proper vendor-specific property and returns its value
 *
 * @example
 * var requestAnimationFrame = vendorize('requestAnimationFrame');
 * // it will refer properly to:
 * //  - window.requestAnimationFrame by default or to
 * //  - window.webkitRequestAnimationFrame or to
 * //  - window.mozRequestAnimationFrame or to
 * //  - window.msRequestAnimationFrame or to
 * //  - window.oRequestAnimationFrame
 * // depending on the current browser vendor
 *
 * @author Mykhailo Stadnyk <mikhus@gmail.com>
 * @param {string} prop
 * @param {HTMLElement|Window|object} [from] - default is window
 * @returns {*}
 */
export default function vendorize(prop, from) {
    /* istanbul ignore else: no reason to cover */
    if (!from) {
        from = typeof window === 'undefined' ? global : window;
    }

    if (typeof from[prop] !== 'undefined') {
        return from[prop];
    }

    let vendors = ['webkit', 'moz', 'ms', 'o'];
    let i = 0;
    let s = vendors.length;
    let capitalized = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (; i < s; i++) {
        let vendorProp = from[vendors[i] + capitalized];

        /* istanbul ignore if: requires very complex environment to test (specific browser version) */
        if (typeof vendorProp !== 'undefined') {
            return vendorProp;
        }
    }

    return null;
}

module.exports = vendorize;
