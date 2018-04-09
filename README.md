# datasource-node
Node.js data source generator for your Handsontable. Works great with datasource-connector plugin.
This generator will generate the express js controller and view(pug) based on [communication specification](https://github.com/handsoncode-apps/datasource-connector/tree/master/doc#handsontable-datasource-communication)

## Installation
Steps to install this package

```bash
$ npm i handsoncode-apps/datasource-node -g
```
## Usage 
```bash
$ cd expressjs_project
$ datasource-node-generator [controller_name]
```
The generator will create 2 files: 
1. The route/[controller_name].js with the methods stub
1. The view/[controller_name].js with the Handsontable html view

This generator will *NOT* update your app.js file, you need to do it manually (please see the generator output).  
