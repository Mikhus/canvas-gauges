const expect = require('chai').expect;
const LinearGauge = require('../../lib/LinearGauge');

describe('LinearGauge', () => {
    it('should be a class', () => {
        expect(LinearGauge).is.a('function');
        expect(() =>
            new LinearGauge({ renderTo: document.createElement('canvas') })
        ).to.not.throw(Error);
    });
});
