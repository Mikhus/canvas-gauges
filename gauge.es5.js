'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @external {Object.assign} https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
/* istanbul ignore next */
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function value(target, firstSource) {
            'use strict';

            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            var i = 1;

            for (; i < arguments.length; i++) {
                var nextSource = arguments[i];

                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                var nextIndex = 0,
                    len = keysArray.length;

                for (; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }

            return to;
        }
    });
}

/**
 * @external {Array.indexOf} https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
/* istanbul ignore next */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }

        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        if (n >= len) {
            return -1;
        }

        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }

            k++;
        }

        return -1;
    };
}

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
function vendorize(prop, from) {
    /* istanbul ignore else: no reason to cover */
    if (!from) {
        from = typeof window === 'undefined' ? global : window;
    }

    if (typeof from[prop] !== 'undefined') {
        return from[prop];
    }

    var vendors = ['webkit', 'moz', 'ms', 'o'];
    var i = 0;
    var s = vendors.length;
    var capitalized = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (; i < s; i++) {
        var vendorProp = from[vendors[i] + capitalized];

        /* istanbul ignore if: requires very complex environment to test (specific browser version) */
        if (typeof vendorProp !== 'undefined') {
            return vendorProp;
        }
    }

    return null;
}

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

/* istanbul ignore next */
/**
 * @type {function(callback: function(time: number): number, element?: HTMLElement)}
 * @access private
 */
var requestAnimationFrame = vendorize('requestAnimationFrame') || function (callback) {
    return setTimeout(function () {
        return callback(new Date().getTime());
    }, 1000 / 60);
};

/**
 * Generic AnimationRule function interface
 *
 * @typedef {function(percent: number): number} AnimationRule
 */

/**
 * Callback for animation step draw event.
 * It will be called each time animation step is executed, bypassing
 * as first argument a percent of animation completeness. It is expected
 * that this callback will do an actual work of animating an elements or
 * whatever, as far as animation engine is just calculating and executing
 * animation steps without any knowledge about things under animation.
 *
 * @typedef {function(percent: number): *} DrawEventCallback
 */

/**
 * Callback for animation complete event.
 * It is called once each animation is complete.
 *
 * @typedef {function(): *} EndEventCallback
 */

/**
 * Predefined known animation rules.
 * It's a simple collection of math for some most used animations.
 *
 * @typedef {{linear: AnimationRule, quad: AnimationRule, dequad: AnimationRule, quint: AnimationRule, dequint: AnimationRule, cycle: AnimationRule, decycle: AnimationRule, bounce: AnimationRule, debounce: AnimationRule, elastic: AnimationRule, delastic: AnimationRule}} AnimationRules
 */

/* istanbul ignore next: no reason covering this */
var rules = {
    linear: function linear(p) {
        return p;
    },
    quad: function quad(p) {
        return Math.pow(p, 2);
    },
    dequad: function dequad(p) {
        return 1 - rules.quad(1 - p);
    },
    quint: function quint(p) {
        return Math.pow(p, 5);
    },
    dequint: function dequint(p) {
        return 1 - Math.pow(1 - p, 5);
    },
    cycle: function cycle(p) {
        return 1 - Math.sin(Math.acos(p));
    },
    decycle: function decycle(p) {
        return Math.sin(Math.acos(1 - p));
    },
    bounce: function bounce(p) {
        return 1 - rules.debounce(1 - p);
    },
    debounce: function debounce(p) {
        var a = 0,
            b = 1;
        for (; 1; a += b, b /= 2) {
            if (p >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * p) / 4, 2) + Math.pow(b, 2);
            }
        }
    },
    elastic: function elastic(p) {
        return 1 - rules.delastic(1 - p);
    },
    delastic: function delastic(p) {
        var x = 1.5;
        return Math.pow(2, 10 * (p - 1)) * Math.cos(20 * Math.PI * x / 3 * p);
    }
};

/* istanbul ignore next: private, not testable */
/**
 * Evaluates animation step and decides if the next step required or
 * stops animation calling a proper events.
 *
 * @access private
 * @param {number} time
 * @param {DrawEventCallback} draw
 * @param {number} start
 * @param {AnimationRule} rule
 * @param {number} duration
 * @param {EndEventCallback} end
 * @param {Animation} anim
 */
function step(time, draw, start, rule, duration, end, anim) {
    if (typeof rule !== 'function') {
        throw new TypeError('Invalid animation rule:', rule);
    }

    var progress = time - start;
    var percent = progress / duration;

    if (percent > 1) {
        percent = 1;
    }

    draw && draw(percent === 1 ? percent : rule(percent));

    if (progress < duration) {
        anim.frame = requestAnimationFrame(function (time) {
            return step(time, draw, start, rule, duration, end, anim);
        });
    } else {
        end && end();
    }
}

/**
 * Animation engine API for JavaScript-based animations.
 * This is simply an animation core framework which simplifies creation
 * of various animations for generic purposes.
 *
 * @example
 * // create 'linear' animation engine, 500ms duration
 * let linear = new Animation('linear', 500);
 *
 * // create 'elastic' animation engine
 * let elastic = new Animation('elastic');
 *
 * // define animation behavior
 * let bounced = new Animation('bounce', 500, percent => {
 *     let value = parseInt(percent * 100, 10);
 *
 *     $('div.bounced').css({
 *         width: value + '%',
 *         height: value + '%'
 *     });
 * });
 *
 * // execute animation
 * bounced.animate();
 *
 * // execute animation and handle when its finished
 * bounced.animate(null, () => {
 *    console.log('Animation finished!');
 * });
 */

var Animation = function () {

    /**
     * @constructor
     * @param {string|AnimationRule} rule
     * @param {number} duration
     * @param {DrawEventCallback} [draw]
     * @param {EndEventCallback} [end]
     */
    function Animation() {
        var rule = arguments.length <= 0 || arguments[0] === undefined ? 'linear' : arguments[0];
        var duration = arguments.length <= 1 || arguments[1] === undefined ? 250 : arguments[1];
        var draw = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];
        var end = arguments.length <= 3 || arguments[3] === undefined ? function () {} : arguments[3];

        _classCallCheck(this, Animation);

        /**
         * Overall animation duration in milliseconds.
         * By default is equal to 250 ms.
         *
         * @type {number}
         */
        this.duration = duration;

        /**
         * Animation rule. By default is linear animation.
         * Animation rule is a subject to animation rules, which are
         * a simple object containing math-based methods for calculating
         * animation steps.
         *
         * @type {string|AnimationRule}
         */
        this.rule = rule;

        /**
         * Callback function for the animation step draw event.
         *
         * @type {DrawEventCallback}
         */
        this.draw = draw;

        /**
         * Callback for the animation complete event.
         *
         * @type {EndEventCallback}
         */
        this.end = end;

        if (typeof this.draw !== 'function') {
            throw new TypeError('Invalid animation draw callback:', draw);
        }

        if (typeof this.end !== 'function') {
            throw new TypeError('Invalid animation end callback:', end);
        }
    }

    /* istanbul ignore next: non-testable */
    /**
     * Performs animation calling each animation step draw callback and
     * end callback at the end of animation. Callbacks are optional to this
     * method call. If them are not bypassed will be used that ones which
     * was pre-set on constructing an Animation object or pre-set after
     * construction.
     *
     * @example
     * function draw(percent) {
     *     $('.my-animated-divs').css({
     *         width: parseInt(percent * 100, 10) + '%'
     *     });
     * }
     * function done() {
     *     console.log('Animation complete!');
     * }
     *
     * // Define 'draw' and 'end' callbacks on construction
     * var animation = new Animation('cycle', 500, draw, done);
     * animation.animate();
     *
     * // Define 'draw' and 'end' callbacks after construction
     * var animation = new Animation('cycle', 500);
     * animation.draw = draw;
     * animation.end = done;
     * animation.animate();
     *
     * // Define 'draw' and 'end' callbacks at animation
     * var animation = new Animation('cycle', 500);
     * animation.animate(draw, done);
     *
     * @param {DrawEventCallback} [draw]
     * @param {EndEventCallback} [end]
     */


    _createClass(Animation, [{
        key: 'animate',
        value: function animate(draw, end) {
            var _this = this;

            //noinspection JSUnresolvedVariable
            var start = vendorize('animationStartTime') || window.performance && window.performance.now ? window.performance.now() : Date.now();

            draw = draw || this.draw;
            end = end || this.end;

            /**
             * Current requested animation frame identifier
             *
             * @type {number}
             */
            this.frame = requestAnimationFrame(function (time) {
                return step(time, draw, start, rules[_this.rule] || _this.rule, _this.duration, end, _this);
            });
        }

        /**
         * Destroys this object properly
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.frame) {
                var cancelAnimationFrame = vendorize('cancelAnimationFrame') ||
                /* istanbul ignore next */
                function (id) {};

                cancelAnimationFrame(this.frame);
                this.frame = null;
            }

            this.draw = null;
            this.end = null;
        }
    }]);

    return Animation;
}();

/**
 * Animation rules bound statically to Animation constructor.
 *
 * @type {AnimationRules}
 * @static
 */


Animation.rules = rules;

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
 * @typedef {{ constructor: function(options: object): GaugeInterface, draw: function(): GaugeInterface }} GaugeInterface
 */

/* istanbul ignore next: private, not testable */
/**
 * Transforms camel case property name to dash separated attribute name
 *
 * @access private
 * @param {string} str
 * @returns {string}
 */
function toAttributeName(str) {
    var arr = str.split(/(?=[A-Z])/);
    var i = 0;
    var s = arr.length;

    str = 'data';

    for (; i < s; i++) {
        str += '-' + arr[i].toLowerCase();
    }

    return str;
}

/* istanbul ignore next: private, not testable */
/**
 * Cross-browser DOM ready handler
 *
 * @access private
 * @param {Function} handler
 */
function domReady(handler) {
    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', handler, false);
    } else {
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

var DomObserver = function () {

    /**
     * @constructor
     * @param {object} options
     * @param {string} element
     * @param {string} type
     * @param {Function} Type
     */
    function DomObserver(options, element, type, Type) {
        var _this2 = this;

        _classCallCheck(this, DomObserver);

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

        /* istanbul ignore next: this should be tested with end-to-end tests */
        domReady(function () {
            _this2.traverse();

            if (window.MutationObserver) {
                //noinspection JSCheckFunctionSignatures
                new MutationObserver(_this2.observe.bind(_this2)).observe(document.body, {
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


    _createClass(DomObserver, [{
        key: 'isValidNode',
        value: function isValidNode(node) {
            return !!(node.tagName && node.tagName.toLowerCase() === this.element && node.getAttribute('data-type') === this.type);
        }

        /**
         * Traverse entire current DOM tree and process matching nodes.
         * Usually it should be called only once on document initialization.
         */

    }, {
        key: 'traverse',
        value: function traverse() {
            var elements = document.getElementsByTagName(this.element);
            var i = 0,
                s = elements.length;

            /* istanbul ignore next: this should be tested with end-to-end tests */
            for (; i < s; i++) {
                var node = elements[i];

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

    }, {
        key: 'observe',
        value: function observe(records) {
            var i = 0;
            var s = records.length;

            /* istanbul ignore next: this should be tested with end-to-end tests */
            for (; i < s; i++) {
                var record = records[i];

                if (record.type === 'attributes' && record.attributeName === 'data-type' && this.isValidNode(record.target) && record.oldValue !== this.type) // skip false-positive mutations
                    {
                        this.process(record.target);
                    } else if (record.addedNodes && record.addedNodes.length) {
                    var ii = 0;
                    var ss = record.addedNodes.length;

                    for (; ii < ss; ii++) {
                        var node = record.addedNodes[ii];

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

    }, {
        key: 'process',


        /**
         * Processes a given node, instantiating a proper type constructor for it
         *
         * @param {Node|HTMLElement} node
         * @returns {GaugeInterface}
         */
        value: function process(node) {
            var prop = void 0;
            var options = JSON.parse(JSON.stringify(this.options));

            for (prop in options) {
                /* istanbul ignore else: non-testable in most cases */
                if (options.hasOwnProperty(prop)) {
                    var attributeName = toAttributeName(prop);
                    var attributeValue = DomObserver.parse(node.getAttribute(attributeName));

                    if (attributeValue !== null && attributeValue !== undefined) {
                        options[prop] = attributeValue;
                    }
                }
            }

            options.renderTo = node;

            return new this.Type(options).draw();
        }
    }], [{
        key: 'parse',
        value: function parse(value) {
            // parse boolean
            if (value === 'true') return true;
            if (value === 'false') return false;

            // parse undefined
            if (value === 'undefined') return undefined;

            // parse null
            if (value === 'null') return null;

            // Comma-separated strings to array parsing.
            // It won't match strings which contains non alphanum characters to
            // prevent strings like 'rgba(0,0,0,0)' or JSON-like from being parsed.
            // Typically it simply allows easily declare arrays as comma-separated
            // numbers or plain strings. If something more complicated is
            // required it can be declared using JSON format syntax
            if (/^[\w\d\s]+(?:,[\w\d\s]+)+$/.test(value)) {
                return value.split(',');
            }

            // parse JSON
            try {
                return JSON.parse(value);
            } catch (e) {}

            // plain value - no need to parse
            return value;
        }
    }]);

    return DomObserver;
}();

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
 * Drawings on canvas using hidden canvas as a cache for better
 * performance drawings during canvas animations. SmartCanvas also
 * adopts a canvas to
 */


var SmartCanvas = function () {

    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {number} width
     * @param {number} height
     */
    function SmartCanvas(canvas, width, height) {
        _classCallCheck(this, SmartCanvas);

        SmartCanvas.collection.push(this);

        /**
         * Canvas base width
         *
         * @type {number}
         */
        this.width = width || 0;

        /**
         * Canvas base height
         *
         * @type {number}
         */
        this.height = height || 0;

        /**
         * Target drawings canvas element
         *
         * @type {HTMLCanvasElement}
         */
        this.element = canvas;

        this.init();
    }

    /**
     * Initializes canvases and contexts
     */


    _createClass(SmartCanvas, [{
        key: 'init',
        value: function init() {
            var pixelRatio = SmartCanvas.pixelRatio;

            this.element.width = this.width * pixelRatio;
            this.element.height = this.height * pixelRatio;

            this.element.style.width = this.width + 'px';
            this.element.style.height = this.height + 'px';

            /**
             * Canvas caching element
             *
             * @type {HTMLCanvasElement|Node}
             */
            this.elementClone = this.element.cloneNode(true);

            //noinspection JSUnresolvedVariable
            /**
             * Target drawings canvas element 2D context
             *
             * @type {CanvasRenderingContext2D}
             */
            this.context = this.element.getContext('2d');

            /**
             * Canvas caching element 2D context
             *
             * @type {CanvasRenderingContext2D}
             */
            this.contextClone = this.elementClone.getContext('2d');

            /**
             * Actual drawings width
             *
             * @type {number}
             */
            this.drawWidth = this.element.width;

            /**
             * Actual drawings height
             *
             * @type {number}
             */
            this.drawHeight = this.element.height;

            /**
             * X-coordinate of drawings zero point
             *
             * @type {number}
             */
            this.drawX = this.drawWidth / 2;

            /**
             * Y-coordinate of drawings zero point
             *
             * @type {number}
             */
            this.drawY = this.drawHeight / 2;

            /**
             * Minimal side length in pixels of the drawing
             *
             * @type {number}
             */
            this.minSide = this.drawX < this.drawY ? this.drawX : this.drawY;

            this.elementClone.initialized = false;

            this.contextClone.translate(this.drawX, this.drawY);
            this.contextClone.save();

            this.context.translate(this.drawX, this.drawY);
            this.context.save();

            this.context.max = this.contextClone.max = this.minSide;
            this.context.maxRadius = this.contextClone.maxRadius = null;
        }

        /**
         * Destroys this object, removing the references from memory
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var index = SmartCanvas.collection.indexOf(this);

            /* istanbul ignore else */
            if (~index) {
                SmartCanvas.collection.splice(index, 1);
            }

            // derefecence all created elements
            this.context.max = null;
            delete this.context.max;

            this.context.maxRadius = null;
            delete this.context.maxRadius;

            this.context = null;
            this.contextClone = null;
            this.elementClone = null;
            this.element = null;

            /**
             * On canvas redraw event callback
             *
             * @type {function|null|undefined}
             */
            this.onRedraw = null;
        }

        /**
         * Commits the drawings
         */

    }, {
        key: 'commit',
        value: function commit() {
            var scale = SmartCanvas.pixelRatio;

            if (scale !== 1) {
                this.contextClone.scale(scale, scale);
                this.contextClone.save();
            }

            return this;
        }

        /**
         * Redraw this object
         */

    }, {
        key: 'redraw',
        value: function redraw() {
            this.init();

            /**
             * On canvas redraw event callback
             *
             * @type {function(): *}
             */
            this.onRedraw && this.onRedraw();

            return this;
        }

        /**
         * Returns current device pixel ratio
         *
         * @returns {number}
         */

    }], [{
        key: 'redraw',


        /**
         * Forces redraw all canvas in the current collection
         */
        value: function redraw() {
            var i = 0;
            var s = SmartCanvas.collection.length;

            for (; i < s; i++) {
                SmartCanvas.collection[i].redraw();
            }
        }
    }, {
        key: 'pixelRatio',
        get: function get() {
            /* istanbul ignore next */
            //noinspection JSUnresolvedVariable
            return window.devicePixelRatio || 1;
        }
    }]);

    return SmartCanvas;
}();

SmartCanvas.collection = [];

/* istanbul ignore next: very browser-specific testing required to cover */
//noinspection JSUnresolvedVariable
if (window.matchMedia) {
    //noinspection JSUnresolvedFunction
    window.matchMedia('screen and (min-resolution: 2dppx)').addListener(SmartCanvas.redraw);
}

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

var SharedOptions = {
    // basic options
    renderTo: null,
    width: 200,
    height: 200,
    minValue: 0,
    maxValue: 100,
    value: 0,
    units: false,
    majorTicks: [0, 20, 40, 60, 80, 100],
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
    highlights: [{ from: 20, to: 60, color: '#eee' }, { from: 60, to: 80, color: '#ccc' }, { from: 80, to: 100, color: '#999' }]
};

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
 * Gauge collections type.
 *
 * It is used ES5 declaration here, because babel
 * transpiles inheritance incorrectly in this case.
 *
 * @class Collection
 * @constructor
 */
function Collection() {
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
Collection.prototype.get = function (id) {
    if (typeof id === 'string') {
        var i = 0;
        var s = this.length;

        for (; i < s; i++) {
            var canvas = this[i].options.renderTo.tagName ? this[i].options.renderTo :
            /* istanbul ignore next: should be tested with e2e tests */
            document.getElementById(this[i].options.renderTo || '');

            if (canvas.getAttribute('id') === id) {
                return this[i];
            }
        }
    } else if (typeof id === 'number') {
        return this[id];
    }

    return null;
};

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

// todo: customizable fonts
// todo: readme and documentation update
// todo: github pages
// todo: wiki
// todo: LinearGauge implementation
// todo: online configurator
// todo: online packager
// todo: e2e tests
// todo: angular 2 integration
// todo: react integrations
// todo: typescript definitions

/**
 * Gauge configuration options
 *
 * @typedef {{renderTo: RenderTarget, width: number, height: number, title: string|boolean, maxValue: number, minValue: number, value: number, majorTicks: Array, minorTicks: number, ticksAngle: number, startAngle: number, strokeTicks: boolean, units: string|boolean, updateValueOnAnimation: boolean, glow: boolean, valueInt: number, valueDec: number, majorTicksInt: number, majorTicksDec: number, animation: boolean, animationDuration: number, animationRule: AnimationRule, colorPlate: string, colorMajorTicks: string, colorMinorTicks: string, colorTitle: string, colorUnits: string, colorNumbers: string, colorNeedleStart: string, colorNeedleEnd: string, colorNeedleCircleOuterStart: string, colorNeedleCircleOuterEnd: string, colorNeedleCircleInnerStart: string, colorNeedleCircleInnerEnd: string, colorNeedleShadowUp: string, colorNeedleShadowDown: string, colorValueBoxRectStart: string, colorValueBoxRectEnd: string, colorValueBoxBackground: string, colorValueBoxShadow: string, colorValueText: string, colorValueTextShadow: string, colorBorderShadow: string, colorBorderOuterStart: string, colorBorderOuterEnd: string, colorBorderMiddleStart: string, colorBorderMiddleEnd: string, colorBorderInnerStart: string, colorBorderInnerEnd: string, needle: boolean, needleShadow: boolean, needleType: string, needleStart: number, needleEnd: number, needleWidth: number, needleCircle: boolean, needleCircleSize: number, needleCircleInner: boolean, needleCircleOuter: boolean, borders: boolean, borderOuter: boolean, borderOuterWidth: number, borderMiddle: boolean, borderMiddleWidth: number, borderInner: boolean, borderInnerWidth: number, borderShadowWidth: number, valueBox: boolean, valueText: boolean, highlights: Highlight[]}} GaugeOptions
 */

/**
 * @access private
 * @typedef {CanvasRenderingContext2D|{max: number, maxRadius: number}} Canvas2DContext
 */

//noinspection JSValidateTypes
/**
 * Default gauge configuration options
 *
 * @access private
 * @type {GaugeOptions}
 */
var defaultGaugeOptions = Object.assign({}, SharedOptions, {
    // basic options
    ticksAngle: 270,
    startAngle: 45,

    // colors
    colorNeedleCircleOuterStart: '#f0f0f0',
    colorNeedleCircleOuterEnd: '#ccc',
    colorNeedleCircleInnerStart: '#e8e8e8',
    colorNeedleCircleInnerEnd: '#f5f5f5',
    colorNeedleShadowUp: 'rgba(2,255,255,0.2)',
    colorNeedleShadowDown: 'rgba(188,143,143,0.45)',
    colorValueBoxRectStart: '#888',
    colorValueBoxRectEnd: '#666',
    colorValueBoxBackground: '#babab2',
    colorValueBoxShadow: 'rgba(0,0,0,1)',

    // needle
    needleStart: 0,
    needleEnd: 85,
    needleWidth: 4,
    needleCircle: true,
    needleCircleSize: 10,
    needleCircleInner: true,
    needleCircleOuter: true
});

/* istanbul ignore next: private, not testable */
/**
 * Formats a number for display on the dial's plate using the majorTicksFormat
 * config option.
 *
 * @access private
 * @param {number} num number to format
 * @param {object} options
 * @returns {string} formatted number
 */
function formatMajorTickNumber(num, options) {
    var right = void 0,
        hasDec = false;

    // First, force the correct number of digits right of the decimal.
    if (options.majorTicksDec === 0) {
        right = Math.round(num).toString();
    } else {
        right = num.toFixed(options.majorTicksDec);
    }

    // Second, force the correct number of digits left of the decimal.
    if (options.majorTicksInt > 1) {
        // Does this number have a decimal?
        hasDec = ~right.indexOf('.');

        // Is this number a negative number?
        if (~right.indexOf('-')) {
            return '-' + [options.majorTicksInt + options.majorTicksDec + 2 + (hasDec ? 1 : 0) - right.length].join('0') + right.replace('-', '');
        } else {
            return [options.majorTicksInt + options.majorTicksDec + 1 + (hasDec ? 1 : 0) - right.length].join('0') + right;
        }
    }

    return right;
}

/* istanbul ignore next: private, not testable */
/**
 * Transforms degrees to radians
 *
 * @param {number} degrees
 * @returns {number}
 */
function radians(degrees) {
    return degrees * Math.PI / 180;
}

/* istanbul ignore next: private, not testable */
/**
 * Calculates and returns radial point coordinates
 *
 * @access private
 * @param {number} radius
 * @param {number} angle
 * @returns {{x: number, y: number}}
 */
function radialPoint(radius, angle) {
    return { x: -radius * Math.sin(angle), y: radius * Math.cos(angle) };
}

/* istanbul ignore next: private, not testable */
/**
 * Creates and returns linear gradient canvas object
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {string} colorFrom
 * @param {string} colorTo
 * @param {number} length
 * @returns {CanvasGradient}
 */
function linearGradient(context, colorFrom, colorTo, length) {
    var grad = context.createLinearGradient(0, 0, 0, length);

    grad.addColorStop(0, colorFrom);
    grad.addColorStop(1, colorTo);

    return grad;
}

/* istanbul ignore next: private, not testable */
/**
 * Pads a given value with leading zeros using the given options
 *
 * @access private
 * @param {number} val
 * @param {{valueInt: number, valueDec: number}} options
 * @returns {string}
 */
function padValue(val, options) {
    var dec = options.valueDec;
    var int = options.valueInt;
    var i = 0;
    var s = void 0,
        strVal = void 0,
        n = void 0;

    val = parseFloat(val);
    n = val < 0;
    val = Math.abs(val);

    if (dec > 0) {
        strVal = val.toFixed(dec).toString().split('.');
        s = int - strVal[0].length;

        for (; i < s; ++i) {
            strVal[0] = '0' + strVal[0];
        }

        strVal = (n ? '-' : '') + strVal[0] + '.' + strVal[1];
    } else {
        strVal = Math.round(val).toString();
        s = int - strVal.length;

        for (; i < s; ++i) {
            strVal = '0' + strVal;
        }

        strVal = (n ? '-' : '') + strVal;
    }

    return strVal;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gradient-filled circle on a canvas
 *
 * @access private
 * @param {number} radius
 * @param {Canvas2DContext} context
 * @param {string} start gradient start color
 * @param {string} end gradient end color
 */
function drawCircle(radius, context, start, end) {
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2, true);
    context.fillStyle = linearGradient(context, start, end, radius);
    context.fill();
    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Returns max radius without borders for the gauge
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 * @return {number}
 */
function maxRadius(context, options) {
    if (!context.maxRadius) {
        context.maxRadius = context.max - options.borderShadowWidth - options.borderOuterWidth - options.borderMiddleWidth - options.borderInnerWidth;
    }

    return context.maxRadius;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge plate on the canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawPlate(context, options) {
    var d0 = options.borderShadowWidth;
    var r0 = context.max - options.borderShadowWidth;
    var r1 = r0 - options.borderOuterWidth;
    var r2 = r1 - options.borderMiddleWidth;
    var r3 = maxRadius(context, options);

    context.save();

    if (options.glow) {
        context.shadowBlur = d0;
        context.shadowColor = options.colorBorderShadow;
    }

    if (options.borders) {
        if (options.borderOuter) {
            drawCircle(r0, context, options.colorBorderOuterStart, options.colorBorderOuterEnd);
        }

        context.restore();

        if (options.borderMiddle) {
            drawCircle(r1, context, options.colorBorderMiddleStart, options.colorBorderMiddleEnd);
        }

        if (options.borderInner) {
            drawCircle(r2, context, options.colorBorderInnerStart, options.colorBorderInnerEnd);
        }
    }

    context.beginPath();
    context.arc(0, 0, r3, 0, Math.PI * 2, true);
    context.fillStyle = options.colorPlate;
    context.fill();
    context.closePath();

    context.save();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge highlight areas on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawHighlights(context, options) {
    context.save();

    var r1 = maxRadius(context, options) - context.max * .05;
    var r2 = r1 - context.max * .15;
    var i = 0,
        s = options.highlights.length;

    for (; i < s; i++) {
        var hlt = options.highlights[i];
        var vd = (options.maxValue - options.minValue) / options.ticksAngle;
        var sa = radians(options.startAngle + (hlt.from - options.minValue) / vd);
        var ea = radians(options.startAngle + (hlt.to - options.minValue) / vd);
        var ps = radialPoint(r2, sa);
        var pe = radialPoint(r1, sa);
        var ps1 = radialPoint(r1, ea);
        var pe1 = radialPoint(r2, ea);

        context.beginPath();
        context.rotate(radians(90));
        context.arc(0, 0, r1, sa, ea, false);
        context.restore();
        context.save();
        context.moveTo(ps.x, ps.y);
        context.lineTo(pe.x, pe.y);
        context.lineTo(ps1.x, ps1.y);
        context.lineTo(pe1.x, pe1.y);
        context.lineTo(ps.x, ps.y);
        context.closePath();

        context.fillStyle = hlt.color;
        context.fill();

        context.beginPath();
        context.rotate(radians(90));
        context.arc(0, 0, r2, sa - 0.2, ea + 0.2, false);
        context.restore();
        context.closePath();

        context.fillStyle = options.colorPlate;
        context.fill();
        context.save();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws minor ticks bar on a canvas
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawMinorTicks(context, options) {
    var radius = maxRadius(context, options) - context.max * .05;

    context.lineWidth = SmartCanvas.pixelRatio;
    context.strokeStyle = options.colorMinorTicks;

    context.save();

    var s = options.minorTicks * (options.majorTicks.length - 1);
    var i = 0;

    for (; i < s; ++i) {
        var angle = options.startAngle + i * (options.ticksAngle / s);

        context.rotate(radians(angle));

        context.beginPath();
        context.moveTo(0, radius);
        context.lineTo(0, radius - context.max * .075);
        context.stroke();
        context.restore();
        context.closePath();

        context.save();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge major ticks bar on a canvas
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawMajorTicks(context, options) {
    var r = maxRadius(context, options) - context.max * .05;
    var i = 0;
    var s = options.majorTicks.length;
    var pixelRatio = SmartCanvas.pixelRatio;

    context.lineWidth = 2 * pixelRatio;
    context.strokeStyle = options.colorMajorTicks;
    context.save();

    if (s === 0) {
        var numberOfDefaultTicks = 5;
        var tickSize = (options.maxValue - options.minValue) / numberOfDefaultTicks;

        for (; i < numberOfDefaultTicks; i++) {
            options.majorTicks.push(formatMajorTickNumber(options.minValue + tickSize * i, options));
        }
        options.majorTicks.push(formatMajorTickNumber(options.maxValue, options));
    }

    i = 0;
    for (; i < s; ++i) {
        var a = options.startAngle + i * (options.ticksAngle / (s - 1));
        context.rotate(radians(a));

        context.beginPath();
        context.moveTo(0, r);
        context.lineTo(0, r - context.max * .15);
        context.stroke();

        context.restore();
        context.closePath();
        context.save();
    }

    if (options.strokeTicks) {
        context.rotate(radians(90));

        context.beginPath();
        context.arc(0, 0, r, radians(options.startAngle), radians(options.startAngle + options.ticksAngle), false);
        context.stroke();
        context.restore();
        context.closePath();

        context.save();
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge bar numbers
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawNumbers(context, options) {
    var radius = maxRadius(context, options) - context.max * .35;
    var points = {};
    var i = 0;
    var s = options.majorTicks.length;

    for (; i < s; ++i) {
        var angle = options.startAngle + i * (options.ticksAngle / (s - 1));
        var point = radialPoint(radius, radians(angle));

        if (angle === 360) angle = 0;

        if (points[angle]) {
            continue; //already drawn at this place, skipping
        }

        points[angle] = true;

        context.font = 20 * (context.max / 200) + 'px Arial';
        context.fillStyle = options.colorNumbers;
        context.lineWidth = 0;
        context.textAlign = 'center';
        context.fillText(options.majorTicks[i], point.x, point.y + 3);
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge title
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawTitle(context, options) {
    if (!options.title) return;

    context.save();
    context.font = 24 * (context.max / 200) + 'px Arial';
    context.fillStyle = options.colorTitle;
    context.textAlign = 'center';
    context.fillText(options.title, 0, -context.max / 4.25, context.max * .8);
    context.restore();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws units name on the gauge
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawUnits(context, options) {
    if (!options.units) return;

    context.save();
    context.font = 22 * (context.max / 200) + 'px Arial';
    context.fillStyle = options.colorUnits;
    context.textAlign = 'center';
    context.fillText(options.units, 0, context.max / 3.25, context.max * .8);
    context.restore();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge needle shadow
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawNeedleShadow(context, options) {
    if (!options.needleShadow) return;

    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 10;
    context.shadowColor = options.colorNeedleShadowDown;
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge needle
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 */
function drawNeedle(context, options) {
    if (!options.needle) return;

    var value = options.value;
    var max = maxRadius(context, options);
    var r1 = max / 100 * options.needleCircleSize;
    var r2 = max / 100 * options.needleCircleSize * 0.75;
    var rIn = max / 100 * options.needleEnd;
    var rStart = options.needleStart ? max / 100 * options.needleStart : 0,
        rOut = max * .2;
    var pad1 = max / 100 * options.needleWidth;
    var pad2 = max / 100 * options.needleWidth / 2;
    var pixelRatio = SmartCanvas.pixelRatio;

    drawNeedleShadow(context, options);

    context.save();

    context.rotate(radians(options.startAngle + (value - options.minValue) / (options.maxValue - options.minValue) * options.ticksAngle));

    if (options.needleType === 'arrow') {
        context.beginPath();
        context.moveTo(-pad2, -rOut);
        context.lineTo(-pad1, 0);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(pixelRatio, rIn);
        context.lineTo(pad1, 0);
        context.lineTo(pad2, -rOut);
        context.closePath();

        context.fillStyle = linearGradient(context, options.colorNeedleStart, options.colorNeedleEnd, rIn - rOut);
        context.fill();

        context.beginPath();
        context.lineTo(-0.5 * pixelRatio, rIn);
        context.lineTo(-1 * pixelRatio, rIn);
        context.lineTo(-pad1, 0);
        context.lineTo(-pad2, -rOut);
        context.lineTo(pad2 / 2 * pixelRatio - 2 * pixelRatio, -rOut);
        context.closePath();
        context.fillStyle = options.colorNeedleShadowUp;
        context.fill();
    } else {
        // simple line needle
        context.beginPath();
        context.moveTo(-pad2, rIn);
        context.lineTo(-pad2, rStart);
        context.lineTo(pad2, rStart);
        context.lineTo(pad2, rIn);
        context.closePath();

        context.fillStyle = linearGradient(context, options.colorNeedleStart, options.colorNeedleEnd, rIn - rOut);
        context.fill();
    }

    context.restore();

    if (options.needleCircle) {
        drawNeedleShadow(context, options);

        if (options.needleCircleOuter) {
            context.beginPath();
            context.arc(0, 0, r1, 0, Math.PI * 2, true);
            context.fillStyle = linearGradient(context, options.colorNeedleCircleOuterStart, options.colorNeedleCircleOuterEnd, r1);
            context.fill();
            context.restore();
            context.closePath();
        }

        if (options.needleCircleInner) {
            context.beginPath();
            context.arc(0, 0, r2, 0, Math.PI * 2, true);
            context.fillStyle = linearGradient(context, options.colorNeedleCircleInnerStart, options.colorNeedleCircleInnerEnd, r2);
            context.fill();
            context.closePath();
        }
    }
}

/* istanbul ignore next: private, not testable */
/**
 * Draws rounded corners rectangle
 *
 * @access private
 * @param {Canvas2DContext} context
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
function roundRect(context, x, y, w, h, r) {
    context.beginPath();

    context.moveTo(x + r, y);
    context.lineTo(x + w - r, y);

    context.quadraticCurveTo(x + w, y, x + w, y + r);
    context.lineTo(x + w, y + h - r);

    context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    context.lineTo(x + r, y + h);

    context.quadraticCurveTo(x, y + h, x, y + h - r);
    context.lineTo(x, y + r);

    context.quadraticCurveTo(x, y, x + r, y);

    context.closePath();
}

/* istanbul ignore next: private, not testable */
/**
 * Draws gauge value box
 *
 * @param {Canvas2DContext} context
 * @param {GaugeOptions} options
 * @param {number} value
 */
function drawValueBox(context, options, value) {
    if (!options.valueText) return;

    var max = context.max;
    var text = padValue(value, options);
    var y = max - max * .33;
    var x = 0;

    context.save();
    context.font = 40 * (max / 200) + 'px Led';
    context.save();

    if (options.valueBox) {
        var th = 0.12 * max;
        var tw = context.measureText('-' + padValue(0, options)).width;

        roundRect(context, -tw / 2 - 0.025 * max, y - th - 0.04 * max, tw + 0.05 * max, th + 0.07 * max, 0.025 * max);
    }

    var grd = context.createRadialGradient(x, y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2, max / 10, x, y - 0.12 * max - 0.025 * max + (0.12 * max + 0.045 * max) / 2, max / 5);

    grd.addColorStop(0, options.colorValueBoxRectStart);
    grd.addColorStop(1, options.colorValueBoxRectEnd);

    context.strokeStyle = grd;
    context.lineWidth = 0.05 * max;
    context.stroke();

    context.shadowBlur = 0.012 * max;
    context.shadowColor = options.colorValueBoxShadow;

    context.fillStyle = options.colorValueBoxBackground;
    context.fill();

    context.restore();

    context.shadowOffsetX = 0.004 * max;
    context.shadowOffsetY = 0.004 * max;
    context.shadowBlur = 0.012 * max;
    context.shadowColor = options.colorValueTextShadow;

    context.fillStyle = options.colorValueText;
    context.textAlign = 'center';
    context.fillText(text, -x, y);

    context.restore();
}

/**
 * Minimalistic HTML5 Canvas Gauge
 * @example
 *  var gauge = new Gauge({
 *     renderTo: 'gauge',
 *     width: 400,
 *     height: 400,
 *     units: 'Km/h',
 *     title: false,
 *     value: 0,
 *     minValue: 0,
 *     maxValue: 220,
 *     majorTicks: [
 *         '0','20','40','60','80','100','120','140','160','180','200','220'
 *     ],
 *     minorTicks: 2,
 *     strokeTicks: false,
 *     highlights: [
 *         { from: 0, to: 50, color: 'rgba(0,255,0,.15)' },
 *         { from: 50, to: 100, color: 'rgba(255,255,0,.15)' },
 *         { from: 100, to: 150, color: 'rgba(255,30,0,.25)' },
 *         { from: 150, to: 200, color: 'rgba(255,0,225,.25)' },
 *         { from: 200, to: 220, color: 'rgba(0,0,255,.25)' }
 *     ],
 *     colorPlate: '#222',
 *     colorMajorTicks: '#f5f5f5',
 *     colorMinorTicks: '#ddd',
 *     colorTitle: '#fff',
 *     colorUnits: '#ccc',
 *     colorNumbers: '#eee',
 *     colorNeedleStart: 'rgba(240, 128, 128, 1)',
 *     colorNeedleEnd: 'rgba(255, 160, 122, .9)',
 *     valueBox: true,
 *     animationRule: 'bounce'
 * });
 * // draw initially
 * gauge.draw();
 * // animate
 * setInterval(() => {
 *    gauge.value = Math.random() * -220 + 220;
 * }, 1000);
 */

var Gauge = function () {

    /**
     * @constructor
     * @param {GaugeOptions} options
     */
    function Gauge(options) {
        _classCallCheck(this, Gauge);

        //noinspection JSUnresolvedFunction
        Gauge.collection.push(this);

        options = Object.assign({}, defaultGaugeOptions, options || {});

        options.startAngle = parseInt(options.startAngle, 10);
        options.ticksAngle = parseInt(options.ticksAngle, 10);

        /* istanbul ignore if */
        if (isNaN(options.startAngle)) options.startAngle = 45;
        /* istanbul ignore if */
        if (isNaN(options.ticksAngle)) options.ticksAngle = 270;

        /* istanbul ignore if */
        if (options.ticksAngle > 360) options.ticksAngle = 360;
        /* istanbul ignore if */
        if (options.ticksAngle < 0) options.ticksAngle = 0;

        /* istanbul ignore if */
        if (options.startAngle < 0) options.startAngle = 0;
        /* istanbul ignore if */
        if (options.startAngle > 360) options.startAngle = 360;

        options.minValue = parseFloat(options.minValue);
        options.maxValue = parseFloat(options.maxValue);

        /* istanbul ignore if */
        if (!(options.highlights instanceof Array)) {
            options.highlights = [];
        }

        if (!options.renderTo) {
            throw TypeError('Canvas element was not specified when creating ' + 'the Gauge object!');
        }

        var canvas = options.renderTo.tagName ? options.renderTo :
        /* istanbul ignore next: to be tested with e2e tests */
        document.getElementById(options.renderTo);

        //noinspection JSUnresolvedVariable
        /**
         * @property {GaugeOptions} Gauge.options
         */
        this.options = options;

        /**
         * @property {SmartCanvas} Gauge.canvas
         */
        this.canvas = new SmartCanvas(canvas, options.width, options.height);
        this.canvas.onRedraw = this.draw.bind(this);

        /**
         * @property {Animation} Gauge.animation
         */
        this.animation = new Animation(options.animationRule, options.animationDuration);
    }

    /**
     * Sets new value for this gauge.
     * If gauge is animated by configuration it will trigger a proper animation.
     * Upsetting a value triggers gauge redraw.
     *
     * @param {number} value
     */


    _createClass(Gauge, [{
        key: 'draw',


        /**
         * Triggering gauge render on a canvas.
         *
         * @returns {Gauge}
         */
        value: function draw() {
            var canvas = this.canvas;
            var x = -canvas.drawX;
            var y = -canvas.drawY;
            var w = canvas.drawWidth;
            var h = canvas.drawHeight;

            var options = this.options;

            if (!canvas.elementClone.initialized) {
                var context = canvas.contextClone;

                // clear the cache
                context.clearRect(x, y, w, h);
                context.save();

                drawPlate(context, options);
                drawHighlights(context, options);
                drawMinorTicks(context, options);
                drawMajorTicks(context, options);
                drawNumbers(context, options);
                drawTitle(context, options);
                drawUnits(context, options);

                canvas.elementClone.initialized = true;
            }

            this.canvas.commit();

            // clear the canvas
            canvas.context.clearRect(x, y, w, h);
            canvas.context.save();

            canvas.context.drawImage(canvas.elementClone, x, y, w, h);
            canvas.context.save();

            drawValueBox(canvas.context, options, this.value);
            drawNeedle(canvas.context, options);

            return this;
        }

        /**
         * Updates gauge configuration options at runtime and redraws the gauge
         *
         * @param {GaugeOptions} options
         * @returns {Gauge}
         */

    }, {
        key: 'update',
        value: function update(options) {
            Object.assign(this.options, options || {});

            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;

            this.animation.rule = this.options.animationRule;
            this.animation.duration = this.options.animationDuration;

            this.canvas.redraw();

            return this;
        }

        /**
         * Performs destruction of this object properly
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var index = Gauge.collection.indexOf(this);

            /* istanbul ignore else */
            if (~index) {
                //noinspection JSUnresolvedFunction
                Gauge.collection.splice(index, 1);
            }

            this.canvas.destroy();
            this.canvas = null;

            this.animation.destroy();
            this.animation = null;
        }
    }, {
        key: 'value',
        set: function set(value) {
            var _this3 = this;

            if (value === this.options.value) return;

            if (this.options.animation) {
                (function () {
                    var fromValue = _this3.options.value;

                    /**
                     * @type {number}
                     * @access private
                     */
                    _this3._value = value;

                    _this3.animation.animate(function (percent) {
                        _this3.options.value = fromValue + (value - fromValue) * percent;

                        _this3.draw();
                    }, function () {
                        _this3.options.value = value;
                        delete _this3._value;
                        _this3.draw();
                    });
                })();
            } else {
                this.options.value = value;
                this.draw();
            }
        }

        /**
         * Returns current value of the gauge
         *
         * @return {number}
         */
        ,
        get: function get() {
            return typeof this._value === 'undefined' ? this.options.value : this._value;
        }
    }]);

    return Gauge;
}();

Gauge.collection = new Collection();

new DomObserver(defaultGaugeOptions, 'canvas', 'gauge', Gauge);

window['Gauge'] = Gauge;

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

var defaultLinearGaugeOptions = Object.assign({}, SharedOptions, {
    // basic options
    orientation: 'vertical'
});

/**
 * Minimalistic HTML5 Canvas Linear Gauge
 */

var LinearGauge = function () {
    function LinearGauge(options) {
        _classCallCheck(this, LinearGauge);

        //noinspection JSUnresolvedFunction
        LinearGauge.collection.push(this);
    }

    _createClass(LinearGauge, [{
        key: 'draw',
        value: function draw() {
            return this;
        }
    }, {
        key: 'update',
        value: function update(options) {}
    }]);

    return LinearGauge;
}();

LinearGauge.collection = new Collection();

new DomObserver(defaultLinearGaugeOptions, 'canvas', 'linear-gauge', LinearGauge);

window['LinearGauge'] = LinearGauge;