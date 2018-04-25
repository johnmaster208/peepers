#!/usr/bin/env node
var command = require('commander');
var chalk = require('chalk');
var Peep = require('./lib/peepers');

command.version('1.0.0');
command.usage('<keywords>');
command.parse(process.argv);
if(command.args.length < 1) {
    command.help();
} else {
    var keywords = command.args;
    Peep.executeQuery(keywords)
}