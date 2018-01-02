#!/usr/bin/env node
const chalk = require('chalk');

const Find = require('@brillout/find');

const {startServer} = require('@reframe/server');

const find = new Find({projectName: 'reframe'});
const pagesDir = find.findProjectDir('pages');
console.log(green_checkmark()+' Page directory found at '+pagesDir);

startServer({pagesDir});

function green_checkmark() {
    return chalk.green('\u2714');
}
