"use strict"
var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()

// create application/json parser
var jsonParser = bodyParser.json()

var data = [
  ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
  ['2017', 10, 11, 12, 13, 15, 16],
  ['2018', 10, 11, 12, 13, 15, 16],
  ['2019', 10, 11, 12, 13, 15, 16],
  ['2020', 10, 11, 12, 13, 15, 16],
  ['2021', 10, 11, 12, 13, 15, 16]
];

/**
   * @param {{e.RequestHandler}} jsonParser
   * @param {{changes:[{row:number,column:number,newValue:string}}], source:String}} req.body
   */
router.post('/afterchange', jsonParser, function (req, res, next) {
  let change = req.body.changes[0];
  data[change.row][change.column] = change.newValue;
  res.json({'data': change})
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

module.exports = router
