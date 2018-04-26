# datasource-node
Node.js data source generator for your Handsontable. Works great with datasource-connector plugin.
This generator will generate the express js controller and view(pug) based on [communication specification](https://github.com/handsoncode-apps/datasource-connector/tree/master/doc#handsontable-datasource-communication)

## Installation
Steps to install this package

```bash
$ npm i handsoncode-apps/datasource-node -g
```
## Basic Usage 
### Generate new express js application with Handsontable spreadsheet 

1. Create express js app with pug view 

```bash
$ npm install express-generator -g
$ express --view=pug myapp
```
1. Generate Handsontable controller and install corresponding pug view with communication plugin  
```bash
$ cd myapp
$ datasource-node myController --engine pug --assets private
```
1. Install required packages
```
$ npm install
```

The generator will create 2 files and download latest assets: 
* route/myController.js - communication methods stub
* view/myController.pug - frontend html view and handsontable initalization
* private/css/handsontable.min.css (handsontable css)
* private/js/handsontable.full.js (handsontable js)
* private/js/datasource-connector.full.js (handsontable data REST data source plugin)


In next step you should add below lines to your app.js file

```javascript
const myController = require('./routes/myController');
app.use('/myController', myController);
app.use(express.static('private'));
```        

1. run server by execute command
```bash
$ npm start
```

The generated project will be on:
```
http://localhost:3000/myController
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
