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
 * Class EventEmitter - base event manager
 */
export default class EventEmitter {
    /**
     * @constructor
     */
    constructor() {
        this._events = {};

        this.addListener = this.on;
        this.removeListener = this.off;
    }

    /**
     * Returns all event listeners
     *
     * @return {object}
     */
    get listeners() {
        return this._events;
    }

    /**
     * Emits given event bypassing to each registered handler given args
     *
     * @param {string} event
     * @param {...*} args
     */
    emit(event, ...args) {
        if (this._events[event]) {
            let i = 0;
            let s = this._events[event].length;

            for (; i < s; i++) {
                this._events[event][i] &&
                this._events[event][i].apply(this, args);
            }
        }
    }

    /**
     * Registers given handler for given event to be called only once when
     * event is emitted
     *
     * @param {string} event
     * @param {...function} handlers
     */
    once(event, ...handlers) {
        let i = 0;
        let s = handlers.length;
        let self = this;

        for (; i < s; i++) {
            let handler = handlers[i];
            let wrapper = function() {
                self.off(event, wrapper);
                handler.apply(self, arguments);
            };

            handlers[i] = wrapper;
        }

        this.on.apply(this, [event].concat(handlers));
    }

    /**
     * Registers given handlers for a given events to be called each time event
     * is emitted
     *
     * @param {string} event
     * @param {...function} handlers
     */
    on(event, ...handlers) {
        if (!this._events[event]) {
            this._events[event] = [];
        }

        let i = 0;
        let s = handlers.length;

        for (; i < s; i++) {
            this._events[event].push(handlers[i]);
        }
    }

    /**
     * Un-registers previously registered event handlers
     *
     * @param {string} event
     * @param {...function} handlers
     */
    off(event, ...handlers) {
        if (!this._events[event]) {
            return ;
        }

        let i = 0;
        let s = handlers.length;

        for (; i < s; i++) {
            let handler = handlers[i];
            let index;

            while (~(index = this._events[event].indexOf(handler))) {
                this._events[event].splice(index, 1);
            }
        }
    }

    /**
     * Removes all listeners for a given event
     *
     * @param {string} event
     */
    removeAllListeners(event) {
        delete this._events[event];
    }
}

module.exports = EventEmitter;
