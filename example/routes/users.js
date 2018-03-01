"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();

// create application/json parser
var jsonParser = bodyParser.json();

var data = [];

var settings = {
  rowHeaders: true,
  colHeaders: true,
  datasourceConnectorPlugin: true,

  contextMenu: true,
  manualColumnMove: true,
  manualRowMove: true,
  columnSorting: {
    column: 0
  },
  sortIndicator: true
};
var cellMeta = {row_id: 'row', column_name: 'column'}
var colOrder = ["first_name", "last_name", "age", "sex", "phone"];
var dataAtBeginning = data;

const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./database.db", function(data) {
  console.log("data", data);
  if (data == null) {
    // initialize database
    db.serialize(function() {
      db.run(
        "CREATE TABLE IF NOT EXISTS `settings` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS `data` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, age INTEGER, sex TEXT, phone TEXT)"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS `cellMeta` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON settings (key)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON data (phone)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS USER_INDEX ON cellMeta (id)"
      );
    });
  }
  // initailize settings
  db.serialize(function() {
    let stmt = db.prepare(
      "INSERT INTO `settings` (`key`, `value`) VALUES (?, ?)"
    );
    stmt.run("settings", JSON.stringify(settings), function(err, data) {});
    stmt.finalize();
  });
  // initailize dummy data
  db.serialize(function() {
    db.all("SELECT * FROM `data` LIMIT 1", (err, rows) => {
      if (rows.length === 0) {
        let stmt = db.prepare(
          "INSERT INTO `data` (`first_name`, `last_name`,`age`,`sex`,`phone`) VALUES (?, ?, ?, ?, ?)"
        );
        stmt.run("John", "Smith", "10", "male", "+435564656");
        stmt.run("Kasia", "Sandwich", "18", "female", "+4325324");
        stmt.run("Jane", "Walker", "60", "female", "+43553456");
        stmt.run("Rafal", "Ek", "34", "male", "+4354324234");
        stmt.run("Kam", "Dobrz", "20", "male", "+435223122");
        stmt.finalize();
      }
    });
  });
  // initailize cellMeta
  db.serialize(function() {
       let stmt = db.prepare(
          "INSERT INTO `cellMeta` ('key', 'value') VALUES (?, ?)"
        );
        stmt.run("cellMeta", JSON.stringify(cellMeta), function(err, data) {});
        stmt.finalize();
      })
  });

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{changes:[{row:number,column:number,newValue:string,meta:{row:number,col:number,visualRow:number,visualCol:number,prop:number,row_id:number,col_id:any}}], source:String}} req.body
 */
router.post("/afterchange", jsonParser, function(req, res, next) {
  let changes = req.body.changes

  for (let i = 0; i < changes.length; i++) {
    let rowId = changes[i].row + 1
    db.serialize(function() {
      let stmt = db.prepare("UPDATE `data` SET " + changes[i].column + " = '" + changes[i].newValue + "' WHERE rowid = '" + rowId + "'")
      stmt.run()
      stmt.finalize()
    })
  }

  res.json({ data: "ok" });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createRow:{index:number,amount:number,source:string}}} req.body
 */
router.post("/aftercreaterow", jsonParser, function(req, res, next) {
  var createRow = req.body;
  var values = [];
  for (var i = 0; i < data[0].values.length; i++) {
    values.push("");
  }
  for (var i = 0; i < createRow.amount; i++) {
    data.splice(createRow.index, 0, { key: "", values: values });
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
  db.all("SELECT * FROM `data`", (err, rows) => {
    res.json({ data: rows, meta: { colOrder: colOrder }, rowId: "id" });
  });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{column:string,order:ASC|DESC|nul}}} req.body
 */
router.get("/aftercolumnsort", function(req, res, next) {
  let sort = {
    column: req.query.column,
    order: req.query.order
  }

  if (sort.column !== 'undefined') {
    if (sort.order === 'true') {
      sort.order = 'ASC'
    } else if ( sort.order === 'false') {
      sort.order = 'DESC'
    } else {
      sort.order = ''
    }
  }

  var tempCol = [];
  var indexes = [];
  
  db.serialize(function() {
    db.all("SELECT * FROM `data` ORDER BY " + sort.column + " " + sort.order, (err, rows) => {
      if (rows) {
        res.json({data: rows})
      }
    })
  })

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

router.get("/settings", jsonParser, function(req, res, next) {
  res.json({ data: settings });
});
//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router;
