#!/usr/bin/env node
/*jshint node:true */
'use strict';

var fs = require('fs'),
    lint = require('jslint/lib/linter').lint,
    bbresults = require('bbresults'),
    pathname = process.env.BB_DOC_PATH;


function run(err, str) {
    var title = 'JSLint results',
        results;

    if (err) {
        bbresults.notify('error, reading ' + pathname, {title: title});
    } else {
        results = lint(str);
        if (results.ok) {
            bbresults.notify(pathname + ' is lint free', {title: title});
        } else {
            bbresults.show(results.errors, pathname, title);
        }
    }
}

if (require.main === module) {
    fs.readFile(pathname, 'utf-8', run);
}
