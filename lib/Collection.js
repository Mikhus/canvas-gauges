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
 * Gauge collections type.
 *
 * It is used ES5 declaration here, because babel
 * transpiles inheritance incorrectly in this case.
 *
 * @class Collection
 * @constructor
 */
export default function Collection () {
    Array.prototype.constructor.apply(this, arguments);
}

Collection.prototype = Object.create(Array.prototype);
Collection.prototype.constructor = Collection;

    /**
     * Returns gauge object by its identifier or index in the collection
     *
     * @param {string|number} id
     * @return {*}
     */
Collection.prototype.get = function(id) {
    if (typeof id === 'string') {
        let i = 0;
        let s = this.length;

        for (; i < s; i++) {
            let canvas = this[i].options.renderTo.tagName ?
                this[i].options.renderTo :
                /* istanbul ignore next: should be tested with e2e tests */
                document.getElementById(this[i].options.renderTo || '');

            if (canvas.getAttribute('id') === id) {
                return this[i];
            }
        }
    }

    else if (typeof id === 'number') {
        return this[id];
    }

    return null;
};

module.exports = Collection;
