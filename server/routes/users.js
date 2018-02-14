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
   * @param {{changes:Array<ChangeArgs>, source:String}} req.body
   */
router.post('/afterchange', jsonParser, function (req, res, next) {
  var tmp = req.body.changes
  data[tmp[0][0]][tmp[0][1]]=tmp[0][3];
  console.log('temp', temp)

  res.json({'data': tmp})
})

router.get('/data', function (req, res, next) {
  res.json(data)
})

module.exports = router
