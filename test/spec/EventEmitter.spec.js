const sinon = require('sinon');
const expect = require('chai').expect;
const EventEmitter = require('../../lib/EventEmitter');

describe('EventEmitter', () => {
    it('should be a class', () => {
        expect(EventEmitter).is.a('function');
        expect(() => new EventEmitter()).to.not.throw(Error);
    });

    describe('constructor()', () => {
        it('should define required class properties', () => {
            let emitter = new EventEmitter();

            expect(emitter._events).to.be.defined;
            expect(emitter.addListener).to.be.defined;
            expect(emitter.removeListener).to.be.defined;
        });
    });

    describe('emit()', () => {
        let emitter;

        before(() => {
            emitter = new EventEmitter();
        });

        it('should not throw', () => {
            expect(() => emitter.emit()).to.not.throw(Error);
        });

        it('should emit properly', () => {
            let one = sinon.spy();
            let two = sinon.spy();

            emitter._events.test = [one, two];

            emitter.emit('test', 1, 2, 3);
            expect(one.calledWith(1, 2, 3)).to.be.true;
            expect(two.calledWith(1, 2, 3)).to.be.true;
        });
    });

    describe('on()', () => {
        let emitter;

        before(() => {
            emitter = new EventEmitter();
        });

        it('should register event handlers properly', () => {
            let one = sinon.spy();
            let two = sinon.spy();

            emitter.on('test', one, two);

            emitter.emit('test', 1, 2, 3);
            expect(one.calledWith(1, 2, 3)).to.be.true;
            expect(two.calledWith(1, 2, 3)).to.be.true;
        });
    });

    describe('off()', () => {
        let emitter;

        before(() => {
            emitter = new EventEmitter();
        });

        it('should un-register event handlers properly', () => {
            let one = sinon.spy();
            let two = sinon.spy();

            emitter.on('test', one, two);
            emitter.off('test', one, two);

            emitter.emit('test');
            expect(one.called).to.be.false;
            expect(two.called).to.be.false;
        });
    });

    describe('once()', () => {
        let emitter;

        before(() => {
            emitter = new EventEmitter();
        });

        it('should register event handlers properly', () => {
            let one = sinon.spy();
            let two = sinon.spy();

            emitter.once('test', one, two);

            emitter.emit('test');
            emitter.emit('test');
            expect(one.calledOnce).to.be.true;
            expect(two.calledOnce).to.be.true;
        });
    });

    describe('removeAllListeners()', () => {
        let emitter;

        before(() => {
            emitter = new EventEmitter();
        });

        it('should register event handlers properly', () => {
            let one = sinon.spy();
            let two = sinon.spy();

            emitter.on('test', one, two);

            emitter.removeAllListeners('test');
            expect(emitter.listeners.test).to.be.undefined;
        });
    });
});
