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
  
    if (program.engine === "manual") {
      console.log(chalk.yellow("\nSetup\
        \nEmbed this code inside your HTML file:"));
      console.log(chalk.green("\t<script src=\"handsontable.full.js\"></script>\
        \n\t<script src=\"dataSourceConnectorPlugin.js\"></script>\
        \n\t<link rel=\"stylesheet\" media=\"screen\" href=\"/dist/handsontable.full.css\">"));
      console.log(chalk.yellow("\nSpreadsheet container\
        \nAdd an empty <div> element that will be turned into a spreadsheet. Let's give this element an \"container\" ID"));
      console.log(chalk.green("\t<div id=\"container\"></div>"));
      console.log(chalk.yellow("\nInitialize\
        \nIn the next step, pass a reference to that `<div class=\"container\">` and setup yor backend controller url by passing into controllerUrl option."));
      console.log(chalk.green("\tvar container = document.getElementById('container');\
        \n\tvar hot = new Handsontable(container, {\
        \n\t\trowHeaders: true,\
        \n\t\tcolHeaders: true,\
        \n\t\tdatasourceConnector: {\
        \n\t\t\tcontrollerUrl: 'http://yourdomain.com/controller',\
        \n\t\t\trequestHeaders: { 'Content-Type': 'application/json' }\
        \n\t\t}\
        \n\t});"));
    }

  if (program.assets) {
    source = path.resolve(path.join(__dirname, '..', 'example', 'public'))
    target = path.resolve(path.join(__dirname, '..', program.assets))
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }
    copydir.sync(source, target)
  }

    console.log(chalk.yellow('\nAssuming that const app = express() add those two lines to your app.js (server) file:'))
    console.log(chalk.green("\tconst " + name + " = require('./routes/" + name + "');"))
    console.log(chalk.green("\tapp.use('/" + name  + "', " + name + ");"))
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
