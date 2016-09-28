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

const SmartCanvas = require('./SmartCanvas');
const Animation = require('./Animation');
const Collection = require('./Collection');
const DomObserver = require('./DomObserver');

const version = '%VERSION%';

const round = Math.round;
const abs = Math.abs;

let gauges = new Collection();

gauges.version = version;

/**
 * Basic abstract BaseGauge class implementing common functionality
 * for different type of gauges.
 *
 * It should not be instantiated directly but must be extended by a final
 * gauge implementation.
 *
 * @abstract
 * @example
 *
 * class MyCoolGauge extends BaseGauge {
 *
 *     // theses methods below MUST be implemented:
 *
 *     constructor(options) {
 *        // ... do something with options
 *        super(options);
 *        // ... implement anything else
 *     }
 *
 *     draw() {
 *         // ... some implementation here
 *         return this;
 *     }
 * }
 */
export default class BaseGauge {

    /**
     * @constructor
     * @abstract
     * @param {GenericOptions} options
     */
    constructor(options) {
        let className = this.constructor.name;

        if (className === 'BaseGauge') {
            throw new TypeError('Attempt to instantiate abstract class!');
        }

        gauges.push(this);

        /**
         * Gauges version string
         *
         * @type {string}
         */
        this.version = version;

        /**
         * Gauge type class
         *
         * @type {BaseGauge} type
         */
        this.type = ns[className];

        /**
         * True if gauge has been drawn for the first time, false otherwise.
         *
         * @type {boolean}
         */
        this.initialized = false;

        options.minValue = parseFloat(options.minValue);
        options.maxValue = parseFloat(options.maxValue);
        options.value = parseFloat(options.value) || 0;

        if (!options.borders) {
            options.borderInnerWidth = options.borderMiddleWidth =
                options.borderOuterWidth = 0;
        }

        if (!options.renderTo) {
            throw TypeError('Canvas element was not specified when creating ' +
                'the Gauge object!');
        }

        let canvas = options.renderTo.tagName ?
            options.renderTo :
            /* istanbul ignore next: to be tested with e2e tests */
            document.getElementById(options.renderTo);

        if (!(canvas instanceof HTMLCanvasElement)) {
            throw TypeError('Given gauge canvas element is invalid!');
        }

        options.width = parseFloat(options.width) || 0;
        options.height = parseFloat(options.height) || 0;

        if (!options.width || !options.height) {
            if (!options.width) options.width = canvas.parentNode ?
                canvas.parentNode.offsetWidth : canvas.offsetWidth;
            if (!options.height) options.height = canvas.parentNode ?
                canvas.parentNode.offsetHeight : canvas.offsetHeight;
        }

        /**
         * Gauge options
         *
         * @type {GenericOptions} options
         */
        this.options = options || {};

        if (this.options.animateOnInit) {
            this._value = this.options.value;
            this.options.value = this.options.minValue;
        }

        /**
         * @type {SmartCanvas} canvas
         */
        this.canvas = new SmartCanvas(canvas, options.width, options.height);
        this.canvas.onRedraw = this.draw.bind(this);

        /**
         * @type {Animation} animation
         */
        this.animation = new Animation(
            options.animationRule,
            options.animationDuration);
    }

    /**
     * Sets new value for this gauge.
     * If gauge is animated by configuration it will trigger a proper animation.
     * Upsetting a value triggers gauge redraw.
     *
     * @param {number} value
     */
    set value(value) {
        value = parseFloat(value);

        if (isNaN(value) || !isFinite(value)) {
            value = this.options.minValue;
        }

        let fromValue = this.options.value;

        if (value === this.options.value) return;

        if (this.options.animation) {
            /**
             * @type {number}
             * @access private
             */
            this._value = value;

            this.animation.animate(percent => {
                this.options.value = fromValue + (value - fromValue) * percent;

                this.draw();
            }, () => {
                this.options.value = value;
                delete this._value;
                this.draw();
            });
        }

        else {
            this.options.value = value;
            this.draw();
        }
    }

    /**
     * Returns current value of the gauge
     *
     * @return {number}
     */
    get value() {
        return typeof this._value === 'undefined' ?
            this.options.value : this._value;
    }

    /**
     * Updates gauge configuration options at runtime and redraws the gauge
     *
     * @param {RadialGaugeOptions} options
     * @returns {BaseGauge}
     */
    update(options) {
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
    destroy() {
        let index = gauges.indexOf(this);

        /* istanbul ignore else */
        if (~index) {
            //noinspection JSUnresolvedFunction
            gauges.splice(index, 1);
        }

        this.canvas.destroy();
        this.canvas = null;

        this.animation.destroy();
        this.animation = null;
    }

    /**
     * Returns gauges version string
     *
     * @return {string}
     */
    static get version() {
        return version;
    }

    /**
     * Triggering gauge render on a canvas.
     *
     * @abstract
     * @returns {BaseGauge}
     */
    draw() {
        if (this.options.animateOnInit && !this.initialized) {
            this.value = this._value;
            this.initialized = true;
        }
    }

    /**
     * Inject given gauge object into DOM
     *
     * @param {string} type
     * @param {GenericOptions} options
     */
    static initialize(type, options) {
        new DomObserver(options, 'canvas', type);
    }
}


/**
 * @ignore
 * @typedef {object} ns
 */
/* istanbul ignore if */
if (typeof ns !== 'undefined') {
    ns['BaseGauge'] = BaseGauge;
    (ns.document || ns)['gauges'] = gauges;
}

module.exports = BaseGauge;
