const expect = require('chai').expect;
const Animation = require('../../lib/Animation');

describe('Animation', () => {
    it('should be a class', () => {
        expect(Animation).is.a('function');
        expect(() => new Animation()).to.not.throw(Error);
    });
});
