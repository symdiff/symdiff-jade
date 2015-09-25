var extract      = require('../index'),
    readFileSync = require('fs').readFileSync,
    join         = require('path').join,
    resolve      = require('path').resolve;

function readFixture(filename) {
    var path = resolve(join(__dirname, filename));
    return readFileSync(path).toString();
}

describe('symdiff-jade', function() {
    it('should work with empty jade', function() {
        var result = extract('');
        expect(result.length).to.equal(0);
    });

    it('should extract a class', function() {
        var fixture = readFixture('fixtures/single_class.jade'),
            result = extract(fixture);

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('grid');
    });

    it('should extract multiple classes', function() {
        var fixture = readFixture('fixtures/multiple_classes.jade'),
            result = extract(fixture);

        expect(result.length).to.equal(2);
        expect(result[0]).to.equal('grid');
        expect(result[1]).to.equal('grid-col');
    });

    it('should extract nothing when there are no classes', function() {
        var fixture = readFixture('fixtures/no_classes.jade'),
            result = extract(fixture);

        expect(result.length).to.equal(0);
    });

    it('should not contain duplicates', function() {
        var fixture = readFixture('fixtures/duplicate_classes.jade'),
            result = extract(fixture);

        expect(result.length).to.equal(1);
        expect(result[0]).to.equal('grid-col');
    });

    it('should pick up optional classes', function() {
        var fixture = readFixture('fixtures/optional_class.jade'),
            result = extract(fixture);
        expect(result.length).to.equal(3);
        expect(result[0]).to.equal('always');
        expect(result[1]).to.equal('a-class');
        expect(result[2]).to.equal('b-class');
        expect(result._warnings).to.be.defined;
        expect(result._warnings.length).to.equal(1);
    });
});
