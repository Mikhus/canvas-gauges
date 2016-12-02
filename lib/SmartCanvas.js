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
 * @ignore
 * @typedef {object} ns
 */

/**
 * Drawings on canvas using hidden canvas as a cache for better
 * performance drawings during canvas animations. SmartCanvas also
 * adopts a canvas to
 */
export default class SmartCanvas {

    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas
     * @param {number} [width]
     * @param {number} [height]
     */
    constructor(canvas, width, height) {
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
    init() {
        let pixelRatio = SmartCanvas.pixelRatio;

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
    destroy() {
        let index = SmartCanvas.collection.indexOf(this);

        /* istanbul ignore else */
        if (~index) {
            SmartCanvas.collection.splice(index, 1);
        }

        this.context.clearRect(
            -this.drawX,
            -this.drawY,
            this.drawWidth,
            this.drawHeight
        );

        // dereference all created elements
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
    commit() {
        let scale = SmartCanvas.pixelRatio;

        if (scale !== 1) {
            this.contextClone.scale(scale, scale);
            this.contextClone.save();
        }

        return this;
    }

    /**
     * Redraw this object
     */
    redraw() {
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
    static get pixelRatio() {
        /* istanbul ignore next */
        //noinspection JSUnresolvedVariable
        return window.devicePixelRatio || 1;
    }

    /**
     * Forces redraw all canvas in the current collection
     */
    static redraw() {
        let i = 0;
        let s = SmartCanvas.collection.length;

        for (; i < s; i++) {
            SmartCanvas.collection[i].redraw();
        }
    }
}

SmartCanvas.collection = [];

/* istanbul ignore next: very browser-specific testing required to cover */
//noinspection JSUnresolvedVariable
if (window.matchMedia) {
    //noinspection JSUnresolvedFunction
    window.matchMedia('screen and (min-resolution: 2dppx)')
        .addListener(SmartCanvas.redraw);
}

module.exports = SmartCanvas;
