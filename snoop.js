#!/usr/bin/env node
var command = require('commander');
var chalk = require('chalk');
var Snoop = require('./lib/snoopers');

command.version('1.0.0');
command.usage('<keywords>');
command.parse(process.argv);

if(command.args.length < 1) {
    command.help();
} else {
    var keywords = command.args;
    Snoop.executeKeywordQuery(keywords);
}

