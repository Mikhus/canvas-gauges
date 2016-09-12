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

            expect(SmartCanvas.collection).includes(canv);
        });
    });

    describe('destroy()', () => {
        it('should remove current instance from SmartCanvas.Collection', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));

            canv.destroy();

            expect(SmartCanvas.collection).not.includes(canv);
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
        xit('should properly scale cached view on commit', () => {
            let initialPxr = window.devicePixelRatio;
            let pxr = window.devicePixelRatio = 2;
            let canv = new SmartCanvas(document.createElement('canvas'));

            sinon.spy(canv.contextClone, 'scale');

            canv.commit();

            //noinspection BadExpressionStatementJS
            expect(canv.contextClone.scale.calledWith(pxr, pxr)).to.be.ok;

            window.devicePixelRatio = initialPxr;
        });
        it('should return this object', () => {
            let canv = new SmartCanvas(document.createElement('canvas'));
            expect(canv.commit()).equals(canv);
        });
    });

    describe('SmartCanvas.redraw()', () => {
        it('should redraw all canvases in collection', () => {
            SmartCanvas.collection.splice(0, SmartCanvas.collection.length);

            let c = document.createElement('canvas');
            let c1 = new SmartCanvas(c);
            let c2 = new SmartCanvas(c);
            let c3 = new SmartCanvas(c);

            c3.onRedraw = () => {};

            expect(SmartCanvas.collection.length).equals(3);

            sinon.spy(c1, 'redraw');
            sinon.spy(c2, 'redraw');
            sinon.spy(c3, 'redraw');

            SmartCanvas.redraw();

            //noinspection BadExpressionStatementJS
            expect(c1.redraw.called).to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(c2.redraw.called).to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(c3.redraw.called).to.be.ok;
        });
    });
});
