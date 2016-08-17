const expect = require('chai').expect;
const vendorize = require('../../lib/vendorize');

describe('vendorize', () => {
    it('should be a function', () => {
        expect(vendorize).is.a('function');
    });
});
