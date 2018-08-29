#!/usr/bin/env node
import command from 'commander';
import chalk from 'chalk'
import Peepers from './lib/peepers'

command.version('1.0.0');
command.usage('<keywords>');
command.parse(process.argv);
if(command.args.length < 1) {
    command.help();
} else {
    let keywords = command.args;
    const Peep = new Peepers().executeQuery(keywords)
    
    // Peep.executeQuery(keywords)
}