#! /usr/bin/env node

'use strict'
const path = require('path');
const fs = require('fs');
const replace = require('stream-replace');
const chalk = require('chalk');
const program = require('commander')

let generate = (name) => {
  let engine = (typeof program.engine === "string") ? program.engine.toLowerCase() : ''
  if (engine === "manual" || engine === "pug") {
    let source = path.resolve(path.join(__dirname,'..','template','routes'));
    let target = path.resolve(path.join('.','routes'));

    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }

    fs.createReadStream(path.format({dir:source, base: 'basic.js'}))
      .pipe(replace(/basic/g, name))
      .pipe(fs.createWriteStream(path.format({dir:target, base: name + '.js'})))
  
    if (program.engine === "pug") {
      source = path.resolve(path.join(__dirname,'..','template','views'));
      target = path.resolve(path.join('.','views'));
    
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target)
      }
    
      fs.createReadStream(path.format({dir:source, base: 'basic.pug'}))
        .pipe(replace(/basic/g, name))
        .pipe(fs.createWriteStream(path.format({dir:target, base: name + '.pug'})))
    }
  
    console.log(chalk.yellow('\nAssuming that const app = express() add those two lines to your app.js (server) file:'))
    console.log(chalk.yellow("\tconst " + name + " = require('./routes/" + name + "');"))
    console.log(chalk.yellow("\tapp.use('/" + name  + "', " + name + ");\n"))
  } else {
    console.log(chalk.red("Flag --engine=manual|pug is required."))
  }

}

program
  .version('0.0.1')
  .arguments('<name>')
  .option('--engine <engine>', 'Datasource-connector engine', /^(manual|pug)$/i)
  .description('Generate hot datasource-connector style controller and pug view for express js\n  <name> - name of controller & view')
  .action(generate)

program
  .parse(process.argv)

if (process.argv.length < 3){
  program.help()
}
