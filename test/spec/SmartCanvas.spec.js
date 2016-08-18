const expect = require('chai').expect;
const SmartCanvas = require('../../lib/SmartCanvas');
const sinon = require('sinon');

describe('SmartCanvas', () => {
    it('should be a class', () => {
        expect(SmartCanvas).is.a('function');
    });

    describe('constructor()', () => {
        it('should throw on construction if element is not a canvas node',
        () => {
            expect(() => new SmartCanvas(undefined)).to.throw(Error);
            expect(() =>
                new SmartCanvas(document.createElement('canvas'), 1, 2))
                    .to.not.throw(Error);
        });
        it('should have width and height properties of number type', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));

            expect(canv.width).to.be.a('number');
            expect(canv.height).to.be.a('number');
        });
        it('should add instance to SmartCanvas.Collection', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));

            expect(SmartCanvas.Collection).includes(canv);
        });
    });

    describe('destroy()', () => {
        it('should remove current instance from SmartCanvas.Collection', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));

            canv.destroy();

            expect(SmartCanvas.Collection).not.includes(canv);
        });
        it('should properly dereference all bound items', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));

            canv.destroy();

            expect(canv.element).to.be.a('null');
            expect(canv.elementClone).to.be.a('null');
            expect(canv.context).to.be.a('null');
            expect(canv.contextClone).to.be.a('null');
            expect(canv.onRedraw).to.be.a('null');
        });
    });

    describe('commit()', () => {
        it('should properly scale cached view on commit', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));
            let pxr = window.devicePixelRatio || 1;

            sinon.spy(canv.contextClone, 'scale');

            canv.commit();

            expect(canv.contextClone.scale.calledWith(pxr, pxr)).to.be.ok;
        });
        it('should return this object', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));
            expect(canv.commit()).to.be.a(canv);
        });
    });

    describe('SmartCanvas.redraw()', () => {
        it('should redraw all canvases in collection', () => {
            SmartCanvas.Collection.splice(0, SmartCanvas.Collection.length);

            let c = document.createElement('canvas');
            let c1 = new SmartCanvas(c);
            let c2 = new SmartCanvas(c);
            let c3 = new SmartCanvas(c);

            c3.onRedraw = () => {};

            expect(SmartCanvas.Collection.length).equals(3);

            sinon.spy(c1, 'redraw');
            sinon.spy(c2, 'redraw');
            sinon.spy(c3, 'redraw');

            SmartCanvas.redraw();

            expect(c1.redraw.called).to.be.ok;
            expect(c2.redraw.called).to.be.ok;
            expect(c3.redraw.called).to.be.ok;
        });
    });
});
