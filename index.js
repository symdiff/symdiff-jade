var jade = require('jade'),
    symdiffHTML = require('symdiff-html');

function symdiffJade(jadeString) {
    return symdiffHTML(jade.render(jadeString));
}

module.exports = symdiffJade;