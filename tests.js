#!/usr/bin/env node

var test = require('tape'),
    lint = require('jslint/lib/linter').lint;


test('jslint returns object with results incl pass/fail', function(t) {
    var actual;

    t.plan(1);
    actual = lint('var no_semicolon');
    t.false(lint.ok);
});

test('jshint errors are an errror property', function(t) {
    t.plan(1);
    var actual = lint('var no_semicolon'),
        expected = [{
            id: '(error)',
           raw: 'Expected \'{a}\' and instead saw \'{b}\'.',
           evidence: 'var no_semicolon',
           line: 1,
           character: 17,
           a: ';',
           b: '(end)',
           c: undefined,
           d: undefined,
           reason: 'Expected \';\' and instead saw \'(end)\'.' }
        ];

    t.same(actual.errors, expected);
});

test('lint-free', function(t) {
    t.plan(1);
    t.true(lint('var isok;').ok);
});

test('lint-free errors property is an empty array', function(t) {
    t.plan(2);
    var actual = lint('var isok;');
    t.true(actual.ok);
    t.same(actual.errors, []);
});
