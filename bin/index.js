#! /usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const replace = require('stream-replace');
const chalk = require('chalk');
const program = require('commander');
const {execSync} = require('child_process');
const copydir = require('copy-dir');
const packageJSON = require('../package.json');

let removeFolderSync = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      var curPath = `${dir}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        removeFolderSync(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
};

let generate = (name) => {
  let engine = (typeof program.engine === 'string') ? program.engine.toLowerCase() : '';
  if (engine === 'manual' || engine === 'pug') {
    let source = path.resolve(path.join(__dirname, '..', 'template', 'routes'));
    let target = path.resolve(path.join('.', 'routes'));

    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }

    fs.createReadStream(path.format({dir: source, base: 'basic.js'}))
      .pipe(replace(/basic/g, name))
      .pipe(fs.createWriteStream(path.format({dir: target, base: `${name}.js`})));

    if (program.engine === 'pug') {
      source = path.resolve(path.join(__dirname, '..', 'template', 'views'));
      target = path.resolve(path.join('.', 'views'));

      if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
      }

      if (!fs.existsSync(target + '/layout.pug')) {
        fs.createReadStream(path.format({dir: source, base: 'layout.pug'}))
          .pipe(fs.createWriteStream(path.format({dir: target, base: 'layout.pug'})));
      }

      fs.createReadStream(path.format({dir: source, base: 'basic.pug'}))
        .pipe(replace(/basic/g, name))
        .pipe(fs.createWriteStream(path.format({dir: target, base: `${name}.pug`})));
    }

    if (program.assets) {
      // eslint-disable-next-line no-console
      console.log('Download latest assets...');
      source = path.resolve(path.join(__dirname, '..', 'template', 'public'));
      let templatePath = path.resolve(path.join(__dirname, '..', 'template'));
      if (fs.existsSync(source)) {
        removeFolderSync(source);
      }

      fs.mkdirSync(source);
      fs.mkdirSync(path.resolve(path.join(source, 'js')));
      fs.mkdirSync(path.resolve(path.join(source, 'css')));

      execSync('npm i --production', {cwd: templatePath, stdio: 'ignore'});

      target = path.resolve(program.assets);
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
      }
      copydir.sync(source, target);
      console.log(`...done!\nAssets Installed on: ${chalk.yellow(path.resolve(program.assets))}\n\n`);
    }

    if (program.engine === 'manual') {
      console.log(chalk.yellow('Add this JavaScript & CSS to your HTML:'));
      console.log('\tassets:');
      console.log(chalk.green('\t\t<script src="/js/handsontable.full.js"></script>' +
        '\n\t\t<script src="/js/datasource-connector.full.js"></script>' +
        '\n\t\t<link rel="stylesheet" media="screen" href="/css/handsontable.full.css">'));
      console.log('\tcontainer:');
      console.log(chalk.green('\t\t<div id="container"></div>'));
      console.log('\tplugin initialization:');
      console.log(chalk.green(`\t\tvar container = document.getElementById('container');\
        \n\t\tvar hot = new Handsontable(container, {\
        \n\t\t\tdataSourceConnector: {\
        \n\t\t\t\tcontrollerUrl: 'http://yourdomain.com/${name}'\
        \n\t\t\t}\
        \n\t\t});\n\n`));
    }

    console.log('\nAssuming that const app = express() add those two lines to your app.js (server) file:');
    console.log(chalk.green(`\tconst ${name} = require('./routes/${name}');`));
    console.log(chalk.green(`\tapp.use('/${name}', ${name});`));
    if (program.assets) {
      console.log(chalk.green(`\tapp.use(express.static('${program.assets}'));`));
    }

    console.log(chalk.yellow('\n\nAll work DONE!'));

  } else {
    console.log(chalk.red('Flag --engine <manual|pug> is required.'));
  }

};

program
  .version(packageJSON.version)
  .arguments('<name>')
  .option('--engine <engine>', 'Datasource-connector engine', /^(manual|pug)$/i)
  .option('--assets <path>', 'The assets path')
  .description('Generate hot datasource-connector style controller and pug view for express js\n  <name> - name of controller & view')
  .action(generate);

program
  .parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}
