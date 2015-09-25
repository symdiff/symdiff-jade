var lex = require('jade-lexer'),
    parse = require('jade-parser'),
    PLUGIN_NAME  = 'symdiff-jade',
    // https://regex101.com/r/yI3bQ2/3
    TERNARY = /^\(.*?\?\s*?(?:["'])([A-Za-z0-9-_]*)(?:["'])\s*?:\s*?(?:["'])([A-Za-z0-9-_]*)(?:["'])\s*?\)$/;

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
        classes = [],
        warnings = [];

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
            // #5 check for ternary
            if (value[0] === '(') {
                var match = value.match(TERNARY);
                if (match !== null) {
                    if (match[1].length) {
                        classes.push(match[1]);
                    }
                    if (match[2].length) {
                        classes.push(match[2]);
                    }
                } else {
                    // add warning
                    warnings.push(PLUGIN_NAME + ": Could not make sense of expression '" + value + "'.");
                }
            } else {
                classes.push(value);
            }
        });
    });
    classes = classes.filter(dedup);
    classes._warnings = warnings;
    return classes;
}

module.exports = symdiffJade;
