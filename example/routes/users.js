"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();

// create application/json parser
var jsonParser = bodyParser.json();

var data = [
  {
    key: 5,
    values: ["2017", 10, 11, 11, 15, 15, 16]
  },
  {
    key: 7,
    values: ["2018", 13, 11, 12, 14, 15, 16]
  },
  {
    key: 11,
    values: ["2019", 10, 11, 13, 9, 15, 16]
  },
  {
    key: 13,
    values: ["2020", 10, 11, 14, 12, 15, 16]
  },
  {
    key: 15,
    values: ["2020", 10, 11, 14, 12, 15, 16]
  }
];
var colNames = ["year", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"];
var colOrder = [0, 1, 2, 3, 4, 5, 6];
var dataAtBeginning = data;

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{changes:[{row:number,column:number,newValue:string,meta:{row:number,col:number,visualRow:number,visualCol:number,prop:number,row_id:number,col_id:any}}], source:String}} req.body
 */
router.post("/afterchange", jsonParser, function(req, res, next) {
  for (var i = 0; i < req.body.changes.length; i++) {
    var change = req.body.changes[i];
    data[change.row].values[change.column] = change.newValue;
    console.log(change);
  }
  res.json({ data: "ok" });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createRow:{index:number,amount:number,source:string}}} req.body
 */
router.post("/aftercreaterow", jsonParser, function(req, res, next) {
  var createRow = req.body;
  for (var i = 0; i < createRow.amount; i++) {
    data.splice(createRow.index, 0, { key: "", values: [] });
  }
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createCol:{index:number,amount:number,source:string}}} req.body
 */
router.post("/aftercreatecol", jsonParser, function(req, res, next) {
  var createCol = req.body;
  colNames.splice(createCol.index, 0, "");
  for (var i = 0; i < data.length; i++) {
    data[i].values.splice([createCol.index], 0, "");
  }
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{sort:[{key:string,values[any]}], filter:[key:string,value:string]}} req.query
 */
router.get("/data", function(req, res, next) {
  res.json({ data: data, columns: colNames, colOrder: colOrder });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{column:string,order:ASC|DESC|nul}}} req.body
 */
router.post("/aftercolumnsort", jsonParser, function(req, res, next) {
  var tmp = req.body;
  var tempCol = [];
  var indexes = [];
  for (var i = 0; i < data.length; i++) {
    tempCol.push(data[i].values[tmp.column]);
  }
  if (tmp.order) {
    var tempColIndexes = [];
    for (var i in tempCol) {
      tempColIndexes.push([tempCol[i], i]);
    }
    tempColIndexes.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    var temp = [];
    for (var j in tempColIndexes) {
      temp.push(tempColIndexes[j][0]);
      indexes.push(tempColIndexes[j][1]);
    }
  } else if (!tmp.order) {
    var tempColIndexes = [];
    for (var i in tempCol) {
      tempColIndexes.push([tempCol[i], i]);
    }
    tempColIndexes.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    var temp = [];
    for (var j in tempColIndexes) {
      temp.push(tempColIndexes[j][0]);
      indexes.push(tempColIndexes[j][1]);
    }
    indexes.reverse();
  }
  var sortedData = [];
  for (var i = 0; i < indexes.length; i++) {
    sortedData.push({
      key: data[indexes[i]].key,
      values: data[indexes[i]].values
    });
  }
  data = sortedData;
  if (tmp.order == undefined) {
    data = dataAtBeginning;
  }
  res.json({ data: data });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{columns:array,target:number}}} req.body
 */
router.post("/aftercolumnmove", jsonParser, function(req, res, next) {
  var colMoved = req.body;

  var columns = colMoved.columns;
  var position = colMoved.target;

  var begin = colOrder
    .slice(0, position)
    .filter(x => columns.indexOf(x) === -1);
  var end = colOrder.slice(position).filter(x => columns.indexOf(x) === -1);

  colOrder = begin;
  colOrder = colOrder.concat(columns);
  colOrder = colOrder.concat(end);

  res.json({ data: colOrder });
});

//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router;
