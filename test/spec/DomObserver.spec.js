const expect = require('chai').expect;
const DomObserver = require('../../lib/DomObserver');

describe('DomObserver', () => {
    it('should be a class', () => {
        expect(DomObserver).is.a('function');
    });
});
