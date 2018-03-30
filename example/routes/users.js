"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();

// create application/json parser
var jsonParser = bodyParser.json();

var settings = {
  rowHeaders: true,
  colHeaders: true,
  datasourceConnectorPlugin: true,
  columnSorting: true,

  contextMenu: true,
  manualColumnMove: true,
  manualRowMove: true,
  sortIndicator: true,
  filters: true,
  dropdownMenu: true,
};

var colOrder = []

const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./database.db", function (data) {
  if (data == null) {
    // initialize database
    db.serialize(function () {
      db.run(
        "CREATE TABLE IF NOT EXISTS `settings` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT)"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS `data` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, age INTEGER, sex TEXT, phone TEXT)"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS `cellMeta` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, rowId TEXT, colId TEXT, meta TEXT)"
      );
      db.run(
        "CREATE TABLE IF NOT EXISTS `rowOrder` (id INTEGER, sort_order INTEGER)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON settings (id)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON data (phone)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS USER_INDEX ON cellMeta (rowId, colId)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS ROW_INDEX on rowOrder (id)"
      )
    });
  }
  // initailize settings
  db.serialize(function () {
    let stmt = db.prepare(
      "INSERT INTO `settings` (`key`, `value`) VALUES (?, ?)"
    );
    stmt.run("settings", JSON.stringify(settings), function (err, data) { });
    stmt.finalize();
  });
  // initailize dummy data
  db.serialize(function () {
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
  // initialize col names
  db.serialize(function() {
    db.all("SELECT sql FROM sqlite_master WHERE tbl_name = 'data' AND type = 'table'", (err, rows) => {
      var regExp = /([a-z0-9_]{1,20}) [A-Z]+[,]{0,1}/g
      var match
      while (match = regExp.exec(rows[0].sql)) {
        colOrder.push(match[0].split(" ")[0])
      }
    })
  })
  
  // initialize row order
  db.serialize(function() {
    db.all("SELECT * FROM `rowOrder` LIMIT 1", (err, rows) => {
      if (rows.length === 0) {
        db.all("SELECT * FROM `data`", (err, rows) => {
          let stmt = db.prepare(
            "INSERT INTO `rowOrder` (`id`, `sort_order`) VALUES (?, ?)"
          )
          for (let i = 0; i < rows.length; i++) {
            stmt.run(rows[i].id, i + 1);
          }
          stmt.finalize();
        })
      }
    })
  })
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{changes:[{row:number,column:number,newValue:string,meta:{row:number,col:number,visualRow:number,visualCol:number,prop:number,row_id:number,col_id:any}}], source:String}} req.body
 */
router.post("/update", jsonParser, function (req, res, next) {

  let changes = req.body.changes

  for (let i = 0; i < changes.length; i++) {
    let rowId = changes[i].row
    let meta = changes[i].meta

    db.run("UPDATE `data` SET " + changes[i].column + " = '" + changes[i].newValue + "' WHERE id = '" + rowId + "'");

    let data = [changes[i].row, changes[i].column, JSON.stringify(meta)];
    db.run("INSERT INTO `cellMeta` ('rowId', 'colId', 'meta') VALUES (?, ?, ?)", data, function (err) {
      if (err) {
        var update = []
        update.push(data[2])
        update.push(data[0])
        update.push(data[1])
        db.run("UPDATE `cellMeta` SET meta=? WHERE rowId=? AND colId=?", update, function (err) {
          if (err)
            return console.error(err.message);
        })
      }
    })
  }

  res.json({ data: "ok" });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createRow:{index:number,amount:number,source:string}}} req.body
 */
router.post("/create/row", jsonParser, function (req, res, next) {
  // TODO: fix this var createRow = req.body;
  db.serialize(function () {
    let stmt = db.prepare("INSERT INTO `data` (`first_name`, `last_name`,`age`,`sex`,`phone`) VALUES ('', '', '', '', '')")
    stmt.run(function(error){
      if (!error){
        db.get("SELECT * from `data` where id= ?",this.lastID,function(error,row){
          db.all("SELECT MAX(sort_order) FROM `rowOrder`", (err, rowOrder) => {
            let position = parseInt(rowOrder[0]['MAX(sort_order)']) + 1;
            db.run("INSERT INTO `rowOrder` (id, sort_order) VALUES ('" + row.id + "', '" + position + "')" )
          })
          res.json({data:row, id:row.id});
        })
      }
    })
    stmt.finalize()
  })
});

router.post("/remove/row", jsonParser, function(req, res, next) {
  var removedRows = req.body
  for (var i = 0; i < removedRows.length; i++) {
    db.run("DELETE FROM `data` WHERE id = '" + removedRows[i] + "'", function(err, row) {
      if (err)
        return console.error(err.message);
    })
  }
  res.json({ data: "ok" });
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{rowMove:{rowsMoved:array,target:number}}} req.body
 */
router.post("/move/row", jsonParser, function(req, res, next) {
  let rowMove = req.body;
  let rowsMoved = rowMove.rowsMoved;
  let target = rowMove.target;
  let stmt = db.prepare("UPDATE `rowOrder` SET sort_order=? WHERE id=? ");
  db.serialize(function() {
    db.all("SELECT * FROM `rowOrder` ORDER BY sort_order ASC", (err, rows) => {
      let filtered = [];
      for (let i = 0; i < rowsMoved.length; i++) {
        let founded = (rows.find((row) => row.id === rowsMoved[i]));
        filtered = rows.filter(row => { return row.id !== rowsMoved[i]} );
        if (founded.sort_order < target) {
          filtered.splice(target - 1, 0, founded);
        } else {
          filtered.splice(target + i, 0, founded);
        }
        rows = filtered;
      }
      for (let j = 0; j < rows.length; j++) {
        rows[j].sort_order = j+1
        stmt.run(rows[j].sort_order, rows[j].id)
      }
      stmt.finalize();
    })
    res.json({data:'ok'});
  })
})

var num = 0;

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createCol:{index:number,amount:number,source:string}}} req.body
 */
router.post("/create/column", jsonParser, function (req, res, next) {
  var createCol = req.body;
  num++;
  colOrder.splice(createCol.index, 0, 'dynamic_' + num);
  db.serialize(function () {
    let stmt = db.prepare("ALTER TABLE `data` ADD COLUMN dynamic_" + num + " TEXT")
    stmt.run(function(err) {
      stmt.finalize()
      if (!err) {
        res.json({name: 'dynamic_' + num})
      }
    })

  })
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{sort:[{key:string,values[any]}], filter:[key:string,value:string]}} req.query
 */
router.post("/data", jsonParser, function (req, res, next) {
  let QueryBuilder = require("../utils/queryBuilder")
  let queryBuilder = new QueryBuilder(req.body)
  let dbQuery = queryBuilder.buildQuery("SELECT data.* FROM `data` JOIN rowOrder ON data.id = rowOrder.id")

  db.all(dbQuery, (err, rows) => {
    res.json({ data: rows, meta: { colOrder: colOrder }, rowId: "id" });
  });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{columns:array,target:number}}} req.body
 */
router.post("/move/column", jsonParser, function (req, res, next) {
  var colMoved = req.body;

  var columns = colMoved.columnNames;
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

router.get("/settings", jsonParser, function (req, res, next) {
  res.json({ data: settings });
});

router.get("/", function(req, res){
  res.render('index')
});

router.post("/remove/column", jsonParser, function (req, res, next) {
  var colRemoved = req.body
  for (var i = 0; i < colRemoved.length; i++) {
    colOrder = colOrder.filter(function(item) { return item !== colRemoved[i] })
  }
  var columnsString = ''
  for (var i = 0; i < colOrder.length; i++) {
    columnsString += colOrder[i]
    if (i !== colOrder.length - 1) {
      columnsString += ", "
    }
  }
  db.serialize(function() {
    db.run("CREATE TABLE data_temp AS SELECT " + columnsString + " FROM data", function(err) {
      if (!err) {
        db.run("DROP TABLE `data`", function(err) {
          if (!err) {
            db.run("ALTER TABLE `data_temp` RENAME TO `data`", function(err) {
              if (!err) {
                res.json({data: "ok"})
              }
            })
          }
        })
      }
    })
  })
})

//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router;
