const expect = require('chai').expect;
const vendorize = require('../../lib/vendorize');

describe('vendorize', () => {
    it('should be a function', () => {
        expect(vendorize).is.a('function');
    });
    it('should return null on non-existing properties request', () => {
        expect(vendorize('ndkwjn3r0932##$#435gdej')).is.a('null');
    });
    it('should return proper reference on existing property', () => {
        expect(vendorize('requestAnimationFrame')).is.a('function');
        expect(vendorize('requestAnimationFrame')).match(/\[native code\]/);
    });
});
