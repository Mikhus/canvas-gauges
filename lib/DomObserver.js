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
 *
 * @authors: Mykhailo Stadnyk <mikhus@gmail.com>
 *           Chris Poile <poile@edwards.usask.ca>
 *           Luca Invernizzi <http://www.lucainvernizzi.net>
 *           Rhys Lloyd <http://rhyslloyd.me>
 *           Robert Blackburn <http://www.rwblackburn.com>
 *           Charles Galpin <https://github.com/cgalpin>
 *           Luca Ghio <https://github.com/cassiodoroVicinetti>
 *           Greg <https://github.com/gregroper>
 *           David Esperalta <info@davidesperalta.com>
 *           Gwenaël (https://thegtricks.thegounet.fr)
 *           migeruhito (https://github.com/migeruhito)
 */

/**
 * @typedef {{ constructor: function(options: object): GaugeInterface, draw: function(): GaugeInterface }} GaugeInterface
 */

/**
 * Transforms camel case property name to dash separated attribute name
 *
 * @access private
 * @param {string} str
 * @returns {string}
 */
function toAttributeName(str) {
    let arr = str.split(/(?=[A-Z])/);
    let i = 0;
    let s = arr.length;

    str = 'data';

    for (; i < s; i++) {
        str += '-' + arr[i].toLowerCase();
    }

    return str;
}

/**
 * Cross-browser DOM ready handler
 *
 * @access private
 * @param {Function} handler
 */
function domReady(handler) {
    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', handler, false);
    }

    else {
        window.attachEvent('onload', handler);
    }
}

/**
 * DOM Observer.
 * It will observe DOM document for a configured element types and
 * instantiate associated Types for an existing or newly added DOM elements
 *
 * @example
 * class ProgressBar {
 *     constructor(options) {}
 *     draw() {}
 * }
 *
 * // It will observe DOM document for elements <div>
 * // having attribute 'data-type="progress"'
 * // and instantiate for each new instance of ProgressBar
 *
 * new DomParser({color: 'red'}, 'div', 'progress', ProgressBar);
 *
 * // assume we could have HTML like this
 * // <div data-type="progress" color="blue"></div>
 * // in this case all matching attributes names for a given options will be
 * // parsed and bypassed to an instance from HTML attributes
 */
export default class DomObserver {

    /**
     * @constructor
     * @param {object} options
     * @param {string} element
     * @param {string} type
     * @param {Function} Type
     */
    constructor(options, element, type, Type) {
        //noinspection JSUnresolvedVariable
        /**
         * Default instantiation options for the given Type
         *
         * @type {Object}
         */
        this.options = options;

        /**
         * Name of an element to lookup/observe
         *
         * @type {string}
         */
        this.element = element.toLowerCase();

        /**
         * data-type attribute value to lookup
         *
         * @type {string}
         */
        this.type = type;

        /**
         * Actual type constructor to instantiate for each found element
         *
         * @type {Function}
         */
        this.Type = Type;

        domReady(() => {
            this.traverse();

            if (window.MutationObserver) {
                //noinspection JSCheckFunctionSignatures
                new MutationObserver(this.observe.bind(this))
                    .observe(document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        characterData: true,
                        attributeOldValue: true,
                        characterDataOldValue: true
                    });
            }
        });
    }

    /**
     * Checks if given node is valid node to process
     *
     * @param {Node|HTMLElement} node
     * @returns {boolean}
     */
    isValidNode(node) {
        return !!(
            node.tagName &&
            node.tagName.toLowerCase() === this.element &&
            node.getAttribute('data-type') === this.type
        );
    }

    /**
     * Traverse entire current DOM tree and process matching nodes.
     * Usually it should be called only once on document initialization.
     */
    traverse() {
        let elements = document.getElementsByTagName(this.element);
        let i = 0, s = elements.length;

        for (; i < s; i++) {
            let node = elements[i];

            if (this.isValidNode(node)) {
                this.process(node);
            }
        }
    }

    /**
     * Observes given mutation records for an elements to process
     *
     * @param {MutationRecord[]} records
     */
    observe(records) {
        let i = 0;
        let s = records.length;

        for (; i < s; i++) {
            let record = records[i];

            if (record.type === 'attributes' &&
                record.attributeName === 'data-type' &&
                this.isValidNode(record.target) &&
                record.oldValue !== this.type) // skip false-positive mutations
            {
                this.process(record.target);
            }

            else if (record.addedNodes && record.addedNodes.length) {
                let ii = 0;
                let ss = record.addedNodes.length;

                for (; ii < ss; ii++) {
                    let node = record.addedNodes[ii];

                    if (this.isValidNode(node)) {
                        this.process(node);
                    }
                }
            }
        }
    }

    /**
     * Parses given attribute value to a proper javascript value
     *
     * @param value
     * @return {*}
     */
    static parse(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (/^\d+(\s*,\s*\d+)+$/.test(value)) return value.split(',');

        try { return JSON.parse(value); } catch(e) {}

        return value;
    }

    /**
     * Processes a given node, instantiating a proper type constructor for it
     *
     * @param {Node|HTMLElement} node
     * @returns {GaugeInterface}
     */
    process(node) {
        let prop;
        let options = JSON.parse(JSON.stringify(this.options));

        for (prop in options) {
            if (options.hasOwnProperty(prop)) {
                let attributeName = toAttributeName(prop);
                let attributeValue = DomObserver.parse(
                    node.getAttribute(attributeName));

                if (attributeValue !== null && attributeValue !== undefined) {
                    options[prop] = attributeValue;
                }
            }
        }

        options.renderTo = node;

        return new (this.Type)(options).draw();
    }
}

module.exports = DomObserver;
