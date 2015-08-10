var lex = require('jade-lexer'),
    parse = require('jade-parser');

function walk(node, fn) {
    var children = [];

    switch(node.type) {
        case 'Tag':
            fn(node);
            children = node.block.nodes;
            break;
        case 'Block':
            children = node.nodes;
    }

    children.forEach(function(child) {
        walk(child, fn);
    });
}

function dedup(c, i, array) {
    return array.lastIndexOf(c) === i;
}

function symdiffJade(jadeString) {
    var ast = parse(lex(jadeString)),
        classes = [];

    walk(ast, function(node) {
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
