const expect = require('chai').expect;
const Gauge = require('../../lib/Gauge');

describe('Gauge', () => {
    it('should be a class', () => {
        expect(Gauge).is.a('function');
        expect(() =>
            new Gauge({ renderTo: document.createElement('canvas') })
        ).to.not.throw(Error);
    });
});
