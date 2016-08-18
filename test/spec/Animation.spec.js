const sinon = require('sinon');
const vendorize = require('../../lib/vendorize');
const expect = require('chai').expect;
const Animation = require('../../lib/Animation');

describe('Animation', () => {
    it('should be a class', () => {
        expect(Animation).is.a('function');
        expect(() => new Animation()).to.not.throw(Error);
    });

    describe('constructor()', () => {
        it('should throw if invalid callbacks bypassed', () => {
            expect(() => new Animation('linear', 500, 'function', () => {}))
                .to.throw(TypeError);
            expect(() => new Animation('linear', 500, () => {}, 'function'))
                .to.throw(TypeError);
        });
    });

    describe('destroy()', () => {
        it('should properly dereference bound objects', () => {
            let anim = new Animation();

            expect(anim.draw).is.a('function');
            expect(anim.end).is.a('function');

            anim.destroy();

            expect(anim.draw).equals(null);
            expect(anim.end).equals(null);
        });
        it('should properly cancel animation on destroy', () => {
            let anim = new Animation();

            window.cancelAnimationFrame = sinon.spy(
                vendorize('cancelAnimationFrame'));

            anim.animate();
            anim.destroy();

            //noinspection BadExpressionStatementJS
            expect(window.cancelAnimationFrame.called).to.be.ok;
        });
    });
});
