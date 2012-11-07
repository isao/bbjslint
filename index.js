#!/usr/local/bin/node
/*jslint nomen:true */
'use strict';

var fs = require('fs'),
    exec = require('child_process').exec,
    ascr = require('applescript'),
    fref = process.env.BB_DOC_PATH,
    fname = process.env.BB_DOC_NAME,
    cmd = __dirname + '/node_modules/jslint/bin/jslint.js --terse ' + fref;


function logerr(err) {
    if (err) {
        console.log(arguments);
    }
}

function notify(msg, cb) {
    exec('terminal-notifier -title bbedit -message "' + msg + '"');
}

function bbitem(fref, line, msg) {
    return [
        '{result_kind: "Error"',
        'result_file: "' + fref + '"',
        'result_line: ' + line,
        'message: "' + msg + '"}'
    ].join();
}

function bbscript(results) {
    return [
        'tell application "BBEdit"',
        'set errs to {' + results.join() + '}',
        'make new results browser with data errs with properties {name:"lint"}',
        'end tell'
    ].join('\n');
}

function parse(lines) {
    var RE = new RegExp('^.{' + fref.length + '}.(\\d+).:(.+)$'),
        bblist = [];

    function eachline(line) {
        var parts = line.match(RE);
        if (parts) {
            bblist.push(bbitem(fref, parts[1], parts[2]));
        }
    }

    lines.forEach(eachline);
    ascr.execString(bbscript(bblist), logerr);
}

function afterExec(err, stdout, stderr) {
    if (err) {
        parse(stdout.split('\n'));
        process.exit(err.code);
    } else {
        notify('no lint in ' + fname);
    }
}

exec(cmd, afterExec);

/*
stdout:
/Users/isao/Repos/bbjslint/index.js(5):Unexpected dangling '_' in '__dirname'.
/Users/isao/Repos/bbjslint/index.js(11):Missing 'use strict' statement.
/Users/isao/Repos/bbjslint/index.js(11):Expected '{' and instead saw 'console'.
/Users/isao/Repos/bbjslint/index.js(11):Expected 'console' at column 5, not column 14.
/Users/isao/Repos/bbjslint/index.js(11):Expected ';' and instead saw '}'.
/Users/isao/Repos/bbjslint/index.js(15):Missing 'use strict' statement.
/Users/isao/Repos/bbjslint/index.js(16):'parse' was used before it was defined.
/Users/isao/Repos/bbjslint/index.js(18):Expected '}' at column 9, not column 5.
/Users/isao/Repos/bbjslint/index.js(19):'notify' was used before it was defined.
*/
