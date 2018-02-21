"use strict"
var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()

// create application/json parser
var jsonParser = bodyParser.json()

var data = [
  ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
  ['2017', 10, 11, 11, 15, 15, 16],
  ['2018', 13, 11, 12, 14, 15, 16],
  ['2019', 10, 11, 13, 9, 15, 16],
  ['2020', 10, 11, 14, 12, 15, 16],
  ['2021', 10, 11, 15, 11, 15, 16]
];
var dataAtBeginning = data

/**
   * @param {{e.RequestHandler}} jsonParser
   * @param {{changes:[{row:number,column:number,newValue:string}}], source:String}} req.body
   */
router.post('/afterchange', jsonParser, function (req, res, next) {
  let change = req.body.changes[0];
  data[change.row][change.column] = change.newValue;
  res.json({ 'data': change })
})

router.post('/aftercreaterow', jsonParser, function (req, res, next) {
  let createRow = req.body
  for (let i = 0; i < createRow.amount; i++) {
    data.splice(createRow.index, 0, [])
  }
})

router.post('/aftercreatecol', jsonParser, function (req, res, next) {
  let createCol = req.body
  for (let i = 0; i < data.length; i++) {
    data[i].splice([createCol.index], 0, '')
  }
})

router.get('/data', function (req, res, next) {
  res.json(data)
})

router.post('/aftercolumnsort', jsonParser, function (req, res, next) {
  let tmp = req.body
  let tempCol = [];
  let indexes = [];
  for (let i = 0; i < data.length; i++) {
    tempCol.push(data[i][tmp.column])
  }
  if (tmp.order) {
    let tempColIndexes = [];
    for (var i in tempCol) {
      tempColIndexes.push([tempCol[i], i]);
    }
    tempColIndexes.sort(function (left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    let temp = [];
    for (var j in tempColIndexes) {
      temp.push(tempColIndexes[j][0]);
      indexes.push(tempColIndexes[j][1]);
    }
  } else if (!tmp.order) {
    let tempColIndexes = [];
    for (var i in tempCol) {
      tempColIndexes.push([tempCol[i], i]);
    }
    tempColIndexes.sort(function (left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    temp = [];
    for (var j in tempColIndexes) {
      temp.push(tempColIndexes[j][0]);
      indexes.push(tempColIndexes[j][1]);
    }
    indexes.reverse()
  }
  let sortedData = []
  for (let i = 0; i < indexes.length; i++) {
    sortedData.push(data[indexes[i]])
  }
  data = sortedData
  if (tmp.order == undefined) {
    data = dataAtBeginning
  }
  res.json({ 'data': data })
})

//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router
