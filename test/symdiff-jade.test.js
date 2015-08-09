var extract  = require('../index'),
    readFile = require('fs').readFile,
    join     = require('path').join,
    resolve  = require('path').resolve;

function readFixture(filename, cb) {
    var path = resolve(join(__dirname, filename));

    readFile(path, function(err, data) {
        if(err) {
            expect.fail(null, null, err.toString());
        }

        cb(data.toString());
    });
}

describe('symdiff-jade', function() {
    it('should work with empty jade', function() {
        var result = extract('');
        expect(result.length).to.equal(0);
    });

    it('should extract a class', function(done) {
        readFixture('fixtures/single_class.jade', function(testJade) {
            var result = extract(testJade);

            expect(result.length).to.equal(1);
            expect(result[0]).to.equal('grid');
            done();
        });
    });

    it('should extract multiple classes', function(done) {
        readFixture('fixtures/multiple_classes.jade', function(testJade) {
            var result = extract(testJade);

            expect(result.length).to.equal(2);
            expect(result[0]).to.equal('grid');
            expect(result[1]).to.equal('grid-col');
            done();
        });
    });

    it('should extract nothing when there are no classes', function(done) {
        readFixture('fixtures/no_classes.jade', function(testJade) {
            var result = extract(testJade);

            expect(result.length).to.equal(0);
            done();
        });
    });

    it('should not contain duplicates', function(done) {
        readFixture('fixtures/duplicate_classes.jade', function(testJade) {
            var result = extract(testJade);

            expect(result.length).to.equal(1);
            expect(result[0]).to.equal('grid-col');
            done();
        });
    });
});
