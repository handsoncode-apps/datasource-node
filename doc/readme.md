# Table of contents
1. [Introduction](#introduction)
2. [Plugin](#plugin)
3. [Publishing data](#publishing-data)
3. [Event handling](#event-handling)
    1. [afterChange](#afterChange)
    2. [afterCreateCol](#afterCreateCol)
    3. [afterCreateRow](#afterCreateRow)
    4. [afterColumnSort](#afterColumnSort)
4. [Use of generator](#generator)

## Introduction 

To use this plugin you should have [Handsontable](https://handsontable.com/download) installed.

## Plugin
This plugin allows to send requests to your custom backend server handling described [events](https://github.com/handsoncode-apps/datasource-node/tree/master/doc#event-handling).

See the reference [here](https://github.com/handsoncode-apps/datasource-connector/blob/master/doc/datasourceConnectorPlugin.md)  

## Publishing data 

See the reference [here](./data.md)

## Event handling

To handle Hot event in your server-side application you may to implement corresponding methods on your backend solution.

### [afterChange](./afterChange.md)<a name="afterChange"></a>


### [afterCreateCol](./afterCreateCol.md)<a name="afterCreateCol"></a>


### [afterCreateRow](./afterCreateRow.md) <a name="afterCreateRow"></a>


### [afterColumnSort](./afterCreateRow.md) <a name="afterCreateRow"></a>


## Use of generator

You can create controller in your routes directory using [datasource-node-generator](./doc/datasource-node-generator.md).