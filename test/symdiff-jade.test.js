var extract = require('../index');

describe('symdiff-jade', function() {
    it('should work with empty jade', function() {
        var result = extract('');
        expect(result.length).to.equal(0);
    });

    it('should extract a class', function() {
        var testJade = 'div.grid',
            result = extract(testJade);

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('grid');
    });

    it('should extract multiple classes', function() {
        var testJade = 'div.grid.grid-col',
            result = extract(testJade);

        expect(result.length).to.equal(2);
        expect(result[0]).to.equal('grid');
        expect(result[1]).to.equal('grid-col');
    });

    it('should extract nothing when there are no classes', function() {
        var testJade = 'script(type="text/javascript")',
            result = extract(testJade);

        expect(result.length).to.equal(0);
    });
});