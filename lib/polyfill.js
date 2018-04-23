/**
 * @external {Object.assign} https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
/* istanbul ignore next */
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
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
                var nextIndex = 0, len = keysArray.length;

                for (; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(
                        nextSource, nextKey);

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
    Object.defineProperty(Array.prototype, "indexOf", {
		value: function(searchElement, fromIndex) {
			var k;

			if (this === null) {
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
		}
	});
}

/**
 * @external {Array.fill} https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
/* istanbul ignore next */
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, "fill", {
		value: function(value) {
			if (this === null) {
				throw new TypeError('this is null or not defined');
			}

			var O = Object(this);
			var len = O.length >>> 0;
			var start = arguments[1];
			var relativeStart = start >> 0;
			var k = relativeStart < 0 ?
				Math.max(len + relativeStart, 0) :
				Math.min(relativeStart, len);
			var end = arguments[2];
			var relativeEnd = end === undefined ?
				len : end >> 0;
			var final = relativeEnd < 0 ?
				Math.max(len + relativeEnd, 0) :
				Math.min(relativeEnd, len);
			while (k < final) {
				O[k] = value;
				k++;
			}

			return O;
		}
	});
    
}

/**
 * mocking window
 */
if (typeof window === 'undefined') {
    window = typeof global === 'undefined' ? {} : global;
}
