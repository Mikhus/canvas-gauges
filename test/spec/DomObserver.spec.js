const sinon = require('sinon');
const expect = require('chai').expect;
const DomObserver = require('../../lib/DomObserver');

describe('DomObserver', () => {
    it('should be a class', () => {
        expect(DomObserver).is.a('function');
    });

    describe('DomObserver.parse()', () => {
        it('should return true if given value is "true"', () => {
            expect(DomObserver.parse('true')).equals(true);
        });
        it('should return false if given value is "false"', () => {
            expect(DomObserver.parse('false')).equals(false);
        });
        it('should return an array if given comma-separated values', () => {
            let arrNum = DomObserver.parse('1,2,3,4,5,6');
            let arrStr = DomObserver.parse('aa,bb,cc,dd,ee');

            expect(arrNum).to.be.an('array');
            expect(arrNum.length).equals(6);
            expect(arrNum).to.eql(['1','2','3','4','5','6']);

            expect(arrStr).to.be.an('array');
            expect(arrStr.length).equals(5);
            expect(arrStr).to.eql(['aa','bb','cc','dd','ee']);

            expect(DomObserver.parse('rgba(0,1,2,0.5)')).not.to.be.an('array');
        });
        it('should properly parse "undefined" and "null"', () => {
            //noinspection BadExpressionStatementJS
            expect(DomObserver.parse('undefined')).to.be.undefined;
            //noinspection BadExpressionStatementJS
            expect(DomObserver.parse('null')).to.be.null;
        });
        it('should properly parse JSON strings and return proper value', () => {
            expect(DomObserver.parse('[1,2,3,4,5]')).to.eql([1,2,3,4,5]);
            expect(DomObserver.parse('{"a":1,"b":[2,3],"c":{"d":4,"e":"5"}}'))
                .to.eql({ a:1, b: [2,3], c: { d: 4, e: '5' }});
        });
    });

    describe('constructor()', () => {
        it('should throw if given element is not a string', () => {
            expect(() => new DomObserver()).to.throw(Error);
        });
    });

    describe('isValidNode()', () => {
        it('should return true if node is valid, false otherwise', () => {
            class Test {
                constructor(options) {}
                draw() {}
            }

            let typeOptions = {};
            let observer = new DomObserver(typeOptions, 'div', 'test', Test);
            let validElement = document.createElement('div');
            let invalidElement = document.createElement('div');
            let anotherInvalidElement = document.createElement('span');

            observer.observe([]); // fake call to improve coverage on untestable
                                  // code

            validElement.setAttribute('data-type', 'test');
            invalidElement.setAttribute('data-type', 'not-test');

            //noinspection BadExpressionStatementJS
            expect(observer.isValidNode(validElement)).to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(observer.isValidNode(invalidElement)).not.to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(observer.isValidNode(anotherInvalidElement)).not.to.be.ok;
        });
    });

    describe('process()', () => {
        it('should properly process given node and create associated type ' +
            'instance', () =>
        {
            let created = false;

            class Test {
                constructor(options) { created= true; }
                draw() {}
            }

            sinon.spy(Test.prototype, 'draw');

            let typeOptions = { bg: '', color: '' };
            let observer = new DomObserver(typeOptions, 'div', 'test', Test);
            let element = document.createElement('div');

            element.setAttribute('data-type', 'test');
            element.setAttribute('data-bg', '#fff');

            observer.process(element);

            //noinspection BadExpressionStatementJS
            expect(created).to.be.ok;
            //noinspection BadExpressionStatementJS
            expect(Test.prototype.draw.called).to.be.ok;
        });
    });
});
