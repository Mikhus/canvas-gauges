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
const vendorize = require('./vendorize');

/**
 * @type {function(time: number, element?: HTMLElement): number}
 * @access private
 */
let requestAnimationFrame = vendorize('requestAnimationFrame') ||
    (callback => setTimeout(() => callback(new Date().getTime()), 1000 / 60));

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

let rules = {
    linear: p => p,
    quad: p => Math.pow(p, 2),
    dequad: p => 1 - rules.quad(1 - p),
    quint: p => Math.pow(p, 5),
    dequint: p => 1 - Math.pow(1 - p, 5),
    cycle: p => 1 - Math.sin(Math.acos(p)),
    decycle: p => Math.sin(Math.acos(1 - p)),
    bounce: p => 1 - rules.debounce(1 - p),
    debounce: p => {
        let a = 0, b = 1;
        for (; 1; a += b, b /= 2) {
            if (p >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * p) / 4, 2) +
                    Math.pow(b, 2);
            }
        }
    },
    elastic: p => 1 - rules.delastic(1 - p),
    delastic: p => {
        let x = 1.5;
        return Math.pow(2, 10 * (p - 1)) *
            Math.cos(20 * Math.PI * x / 3 * p);
    }
};

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
 */
function step(time, draw, start, rule, duration, end) {
    let progress = time - start;
    let percent = progress / duration;

    if (percent > 1) {
        percent = 1;
    }

    draw && draw(percent === 1 ? percent : rule(percent));

    if (progress < duration) {
        requestAnimationFrame(time =>
            step(time, draw, start, rule, duration, end)
        );
    }

    else {
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
export default class Animation {

    /**
     * @constructor
     * @param {string|AnimationRule} rule
     * @param {number} duration
     * @param {DrawEventCallback} [draw]
     * @param {EndEventCallback} [end]
     */
    constructor(rule = 'linear', duration = 250, draw, end) {
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
        this.rule = rules[rule] || rule;

        /**
         * Callback function for the animation step draw event.
         *
         * @type {DrawEventCallback}
         */
        this.draw = draw || (() => {});

        /**
         * Callback for the animation complete event.
         *
         * @type {EndEventCallback}
         */
        this.end = end || (() => {});

        if (typeof this.rule !== 'function') {
            throw new TypeError('Invalid animation rule:', rule);
        }

        if (typeof this.draw !== 'function') {
            throw new TypeError('Invalid animation draw callback:', draw);
        }

        if (typeof this.end !== 'function') {
            throw new TypeError('Invalid animation end callback:', end);
        }
    }

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
    animate(draw, end) {
        const start = vendorize('animationStartTime') ||
            window.performance && window.performance.now ?
                window.performance.now() :
                Date.now();

        draw = draw || this.draw;
        end = end || this.end;

        requestAnimationFrame(time =>
            step(time, draw, start, this.rule, this.duration, end));
    }
}

/**
 * Animation rules bound statically to Animation constructor.
 *
 * @type {AnimationRules}
 * @static
 */
Animation.rules = rules;

module.exports = Animation;
