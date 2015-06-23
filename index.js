var lex = require('jade-lexer'),
    parse = require('jade-parser');

function walk(node, fn) {
    fn(node);
    if (node.nodes && node.nodes.forEach) {
        node.nodes.forEach(function(child) {
            walk(child, fn);
        });
    }
}

function dedup(c, i, array) {
    return array.lastIndexOf(c) === i;
}

function symdiffJade(jadeString) {
    var ast = parse(lex(jadeString)),
        classes = [];

    walk(ast, function(node) {
        if (!node.attrs) {
            return;
        }
        
        node.attrs.forEach(function(attr) {
            if (attr.name !== 'class') {
                return;
            }
            var value = attr.val;
            if (!attr.escaped) {
                // escape
                value = value.replace(/\'/gi, '');
            }
            classes.push(value);
        });
    });

    return classes.filter(dedup);
}

module.exports = symdiffJade;