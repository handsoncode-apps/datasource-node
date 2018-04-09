#! /usr/bin/env node

'use strict'
const path = require('path');
const fs = require('fs');
const replace = require('stream-replace');

var generate = (name) => {
  let source = path.resolve(path.join(__dirname,'..','template','routes'));
  let target = path.resolve(path.join('.','routes'));

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target)
  }

  fs.createReadStream(path.format({dir:source, base: 'basic.js'}))
    .pipe(replace(/basic/g, name))
    .pipe(fs.createWriteStream(path.format({dir:target, base: name + '.js'})))

  source = path.resolve(path.join(__dirname,'..','template','views'));
  target = path.resolve(path.join('.','views'));

  if (!fs.existsSync(target)) {
    fs.mkdirSync(target)
  }

  fs.createReadStream(path.format({dir:source, base: 'basic.pug'}))
    .pipe(replace(/basic/g, name))
    .pipe(fs.createWriteStream(path.format({dir:target, base: name + '.pug'})))

  console.log('\nAssuming that var app = express() add those two lines to your app.js (server) file:')
  console.log("\tvar " + name + " = require('./routes/" + name + "')")
  console.log("\tapp.use('/" + name  + "'," + name + ")")
}

const program = require('commander')
program
  .version('0.0.1')
  .arguments('<name>')
  .description('Generate hot datasource-connector style controller and pug view for express js\n  <name> - name of controller & view')
  .action(generate)

program
  .parse(process.argv)

if (process.argv.length < 3){
  program.help()
}