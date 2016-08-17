const expect = require('chai').expect;
const SmartCanvas = require('../../lib/SmartCanvas');

describe('SmartCanvas', () => {
    it('should be a class', () => {
        expect(SmartCanvas).is.a('function');
    });
});
