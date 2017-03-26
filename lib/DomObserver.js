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
 * @typedef {{ constructor: function(options: GenericOptions): GaugeInterface, draw: function(): GaugeInterface, destroy: function, update: function(options: GenericOptions) }} GaugeInterface
 */
/**
 * @typedef {{parse: function, stringify: function}} JSON
 * @external {JSON} https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON
 */
/**
 * @ignore
 * @typedef {{MutationObserver: function}} ns
 */

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
     */
    constructor(options, element, type) {
        //noinspection JSUnresolvedVariable
        /**
         * Default instantiation options for the given type
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
        this.type = DomObserver.toDashed(type);

        /**
         * Actual type constructor to instantiate for each found element
         *
         * @type {Function}
         */
        this.Type = ns[type];

        /**
         * Signals if mutations observer for this type or not
         *
         * @type {boolean}
         */
        this.mutationsObserved = false;

        /**
         * Flag specifies whenever the browser supports observing
         * of DOM tree mutations or not
         *
         * @type {boolean}
         */
        this.isObservable = !!window.MutationObserver;

        /* istanbul ignore next: this should be tested with end-to-end tests */
        if (!window.GAUGES_NO_AUTO_INIT) {
            DomObserver.domReady(this.traverse.bind(this));
        }
    }

    /**
     * Checks if given node is valid node to process
     *
     * @param {Node|HTMLElement} node
     * @returns {boolean}
     */
    isValidNode(node) {
        //noinspection JSUnresolvedVariable
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

        /* istanbul ignore next: this should be tested with end-to-end tests */
        for (; i < s; i++) {
            this.process(elements[i]);
        }

        if (this.isObservable && !this.mutationsObserved) {
            new MutationObserver(this.observe.bind(this))
                .observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                });

            this.mutationsObserved = true;
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

        /* istanbul ignore next: this should be tested with end-to-end tests */
        for (; i < s; i++) {
            let record = records[i];

            if (record.type === 'attributes' &&
                record.attributeName === 'data-type' &&
                this.isValidNode(record.target) &&
                record.oldValue !== this.type) // skip false-positive mutations
            {
                setTimeout(this.process.bind(this, record.target));
            }

            else if (record.addedNodes && record.addedNodes.length) {
                let ii = 0;
                let ss = record.addedNodes.length;

                for (; ii < ss; ii++) {
                    setTimeout(this.process.bind(this, record.addedNodes[ii]));
                }
            }
        }
    }

    /**
     * Parses given attribute value to a proper JavaScript value.
     * For example it will parse some stringified value to a proper type
     * value, e.g. 'true' => true, 'null' => null, '{"prop": 20}' => {prop: 20}
     *
     * @param {*} value
     * @return {*}
     */
    static parse(value) {
        // parse boolean
        if (value === 'true') return true;
        if (value === 'false') return false;

        // parse undefined
        if (value === 'undefined') return undefined;

        // parse null
        if (value === 'null') return null;

        // Comma-separated strings to array parsing.
        // It won't match strings which contains non alphanumeric characters to
        // prevent strings like 'rgba(0,0,0,0)' or JSON-like from being parsed.
        // Typically it simply allows easily declare arrays as comma-separated
        // numbers or plain strings. If something more complicated is
        // required it can be declared using JSON format syntax
        if (/^[-+#.\w\d\s]+(?:,[-+#.\w\d\s]*)+$/.test(value)) {
            return value.split(',');
        }

        // parse JSON
        try { return JSON.parse(value); } catch(e) {}

        // plain value - no need to parse
        return value;
    }

    /**
     * Processes a given node, instantiating a proper type constructor for it
     *
     * @param {Node|HTMLElement} node
     * @returns {GaugeInterface|null}
     */
    process(node) {
        if (!this.isValidNode(node)) return null;

        let prop;
        let options = JSON.parse(JSON.stringify(this.options));
        let instance = null;

        for (prop in options) {
            /* istanbul ignore else: non-testable in most cases */
            if (options.hasOwnProperty(prop)) {
                let attributeName = DomObserver.toAttributeName(prop);
                let attributeValue = DomObserver.parse(
                    node.getAttribute(attributeName));

                if (attributeValue !== null && attributeValue !== undefined) {
                    options[prop] = attributeValue;
                }
            }
        }

        options.renderTo = node;
        instance = new (this.Type)(options);
        instance.draw && instance.draw();

        if (!this.isObservable) return instance;

        instance.observer = new MutationObserver(records => {
            records.forEach(record => {
                if (record.type === 'attributes') {
                    let attr = record.attributeName.toLowerCase();
                    let type = node.getAttribute(attr).toLowerCase();

                    if (attr === 'data-type' && type && type !== this.type) {
                        instance.observer.disconnect();
                        delete instance.observer;
                        instance.destroy && instance.destroy();
                    }

                    else if (attr.substr(0, 5) === 'data-') {
                        let prop = attr.substr(5).split('-').map((part, i) => {
                            return !i ? part :
                            part.charAt(0).toUpperCase() + part.substr(1);
                        }).join('');
                        let options = {};

                        options[prop] = DomObserver.parse(
                            node.getAttribute(record.attributeName));


                        if (prop === 'value') {
                            instance && (instance.value = options[prop]);
                        }

                        else {
                            instance.update && instance.update(options);
                        }
                    }
                }
            });
        });

        //noinspection JSCheckFunctionSignatures
        instance.observer.observe(node, { attributes: true });

        return instance;
    }

    /**
     * Transforms camelCase string to dashed string
     *
     * @static
     * @param {string} camelCase
     * @return {string}
     */
    static toDashed(camelCase) {
        let arr = camelCase.split(/(?=[A-Z])/);
        let i = 1;
        let s = arr.length;
        let str = arr[0].toLowerCase();

        for (; i < s; i++) {
            str += '-' + arr[i].toLowerCase();
        }

        return str;
    }

    /**
     * Transforms dashed string to CamelCase representation
     *
     * @param {string} dashed
     * @param {boolean} [capitalized]
     * @return {string}
     */
    static toCamelCase(dashed, capitalized = true) {
        let arr = dashed.split(/-/);
        let i = 0;
        let s = arr.length;
        let str = '';

        for (; i < s; i++) {
            if (!(i || capitalized)) {
                str += arr[i].toLowerCase();
            }

            else {
                str += arr[i][0].toUpperCase() + arr[i].substr(1).toLowerCase();
            }
        }

        return str;
    }

    /**
     * Transforms camel case property name to dash separated attribute name
     *
     * @static
     * @param {string} str
     * @returns {string}
     */
    static toAttributeName(str) {
        return 'data-' + DomObserver.toDashed(str);
    }

    /**
     * Cross-browser DOM ready handler
     *
     * @static
     * @param {Function} handler
     */
    static domReady(handler) {
        if (/comp|inter|loaded/.test((window.document || {}).readyState + ''))
            return handler();

        if (window.addEventListener)
            window.addEventListener('DOMContentLoaded', handler, false);

        else if (window.attachEvent)
            window.attachEvent('onload', handler);
    }

}

module.exports = DomObserver;
