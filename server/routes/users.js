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
   * @param {{changes:Array<ChangeArgs>, source:String}} req.body
   */
router.post('/afterchange', jsonParser, function (req, res, next) {
  var tmp = req.body.changes
  data[tmp[0][0]][tmp[0][1]]=tmp[0][3];

  res.json({'data': tmp})
})

router.get('/data', function (req, res, next) {
  res.json(data)
})

router.post('/aftercolumnsort', jsonParser, function (req, res, next) {
  let tmp = req.body
  let tempCol = [];
  let indexes = [];
  for (let i=0; i < data.length; i++) {
    tempCol.push(data[i][tmp.column])
  }
  if (tmp.order) {
    let tempColIndexes = [];
    for (var i in tempCol) {
        tempColIndexes.push([tempCol[i], i]);
    }
    tempColIndexes.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });
    temp = [];
    for (var j in tempColIndexes) {
        temp.push(tempColIndexes[j][0]);
        indexes.push(tempColIndexes[j][1]);
    }
  } else if (!tmp.order) {
    let tempColIndexes = [];
    for (var i in tempCol) {
        tempColIndexes.push([tempCol[i], i]);
    }
    tempColIndexes.sort(function(left, right) {
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
  for(let i=0; i<indexes.length; i++) {
    sortedData.push(data[indexes[i]])
  }
  data = sortedData
  if (tmp.order == undefined) {
    data = dataAtBeginning
  }
  res.json({'data': data})
})

//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router
