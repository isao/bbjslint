#!/usr/bin/env node
/*jshint node:true */
'use strict';

var fs = require('fs'),
    lint = require('jslint/lib/linter').lint,
    ascr = require('applescript'),
    note = require('terminal-notifier'),

    fref = process.env.BB_DOC_PATH,
    fname = process.env.BB_DOC_NAME,
    TITLE = 'bbedit jslint';


function logerr(err) {
    if (err) {
        console.log(err);
    }
}

function errorObj(results) {
    var out = [];
    results.forEach(function (res) {
        var item = [
                '{result_kind: "Error"',
                'result_file: "' + fref + '"',
                'result_line: ' + res.line,
                'message: "' + res.reason.replace(/"/g, '\\"') + '"}' //escape
            ].join();
        out.push(item);
    });
    return '{' + out.join() + '}';
}

function errorScriptStr(listobj, fname) {
    return [
        'tell application "BBEdit"',
        'set errs to ' + listobj,
        'make new results browser with data errs with properties {name:"' + TITLE +'"}',
        'end tell'
    ].join('\n');
}

function run(err, str) {
    var results;
    if (err) {
        note("error. couldn't read bbedit document.", {title: TITLE});
    } else {
        results = lint(str);
        if (results.ok) {
            note('no lint in ' + fname, {title: TITLE});
        } else {
            ascr.execString(errorScriptStr(errorObj(results.errors)), logerr);
        }
    }
}

if (require.main === module) {
    fs.readFile(fref, 'utf-8', run);
}

/*
    > var lint = require('jslint/lib/linter').lint
    undefined
    > lint("var a")
    { functions: [],
      errors:
       [ { id: '(error)',
           raw: 'Expected \'{a}\' and instead saw \'{b}\'.',
           evidence: 'var a',
           line: 1,
           character: 6,
           a: ';',
           b: '(end)',
           c: undefined,
           d: undefined,
           reason: 'Expected \';\' and instead saw \'(end)\'.' } ],
      globals: [ 'a' ],
      ok: false,
      options: { node: true, es5: true } }
*/
