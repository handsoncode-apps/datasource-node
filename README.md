# datasource-node
Node.js data source generator for your Handsontable. Works great with datasource-connector plugin.
This generator will generate the express js controller and view(pug) based on [communication specification](https://github.com/handsoncode-apps/datasource-connector/tree/master/doc#handsontable-datasource-communication)

## Installation
Steps to install this package

```bash
$ npm i handsoncode-apps/datasource-node -g
```
## Usage 
### Generate express js router and pug view
```bash
$ cd expressjs_project
$ datasource-node-generator [controller_name] --engine pug
```
The generator will create 2 files: 
1. The route/[controller_name].js with the methods stub
1. The view/[controller_name].pug with the html view

### Generate express js router only
```bash
$ cd expressjs_project
$ datasource-node-generator [controller_name] --engine manual
```

The generator will create file: 
1. The route/[controller_name].js with the methods stub

### Generate express js router and static assets
```bash
$ cd expressjs_project
$ datasource-node-generator [controller_name] --engine manual --assets ~/assets
```

The generator will create files: 
1. The route/[controller_name].js with the methods stub
And download the latest release version of:
1. The ~/assets/js/datasource-connector.full.js 
1. The ~/assets/js/handsontable.full.js 
1. The ~/assets/css/handsontable.min.css 


This generator will *NOT* update your app.js file, you need to do it manually (please see the generator output).  

In case of assets, remember to add it to your static folder.
