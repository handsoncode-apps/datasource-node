# datasource-node
Node.js data source generator for your Handsontable. Works great with datasource-connector plugin.
This generator will generate the express js controller and view(pug) based on [communication specification](https://github.com/handsoncode-apps/datasource-connector/tree/master/doc#handsontable-datasource-communication)

## Installation
Steps to install this package

```bash
$ npm i handsoncode-apps/datasource-node -g
```
## Basic Usage 
### Generate express js router and pug view

Create express js app with pug view and static assets folllowing commands 

```bash
$ npm install express-generator -g
$ express --view=pug myapp
$ cd myapp
$ datasource-node myController --engine pug --assets private
$ npm install
```
The generator will  create 2 files: 
1. The route/myController.js with the methods stub
2. The view/myController.pug with the html view

and download the latest realised version of handsontable.min.css to css folder.

In next step you should add below lines to your app.js file

```javascript
const myController = require('./routes/myController');
app.use('/myController', myController);
app.use(express.static('private'));
```        

## Advanced usage
### Generate express js router only

```bash
$ cd myapp
$ datasource-node myController --engine manual
```

The generator will create file: 
1. The route/myController.js with the methods stub

### Generate express js router and static assets

```bash
$ cd myapp
$ datasource-node myController --engine manual --assets private
```

The generator will create files: 
1. The route/myController.js with the methods stub
And download the latest release version of:
1. The ~/assets/js/datasource-connector.full.js 
2. The ~/assets/js/handsontable.full.js 
3. The ~/assets/css/handsontable.min.css 


This generator will *NOT* update your app.js file, you need to do it manually (please see the generator output).  

In case of assets, remember to add it to your static folder.
