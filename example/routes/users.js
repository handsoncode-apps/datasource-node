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
  columnSorting: true,

  contextMenu: true,
  manualColumnMove: true,
  manualRowMove: true,
  sortIndicator: true,
  filters: true,
  dropdownMenu: true,
};
var cellMeta = [];
var colOrder = ["first_name", "last_name", "age", "sex", "phone"];
var dataAtBeginning = data;

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
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON settings (id)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON data (phone)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS USER_INDEX ON cellMeta (rowId, colId)"
      );
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
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{changes:[{row:number,column:number,newValue:string,meta:{row:number,col:number,visualRow:number,visualCol:number,prop:number,row_id:number,col_id:any}}], source:String}} req.body
 */
router.post("/afterchange", jsonParser, function (req, res, next) {

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
router.post("/aftercreaterow", jsonParser, function (req, res, next) {
  var createRow = req.body;
  var values = [];
  db.serialize(function () {
    let stmt = db.prepare("INSERT INTO `data` (`first_name`, `last_name`,`age`,`sex`,`phone`) VALUES ('', '', '', '', '')")
    stmt.run()
    stmt.finalize()
  })
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createCol:{index:number,amount:number,source:string}}} req.body
 */
router.post("/aftercreatecol", jsonParser, function (req, res, next) {
  var createCol = req.body;
  colNames.splice(createCol.index, 0, "");
  db.serialize(function () {
    let stmt = db.prepare("alter table `data` add column testy TEXT")
    stmt.run()
    stmt.finalize()
  })
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{sort:[{key:string,values[any]}], filter:[key:string,value:string]}} req.query
 */
router.get("/data", function (req, res, next) {
  db.all("SELECT * FROM `data`", (err, rows) => {
    res.json({ data: rows, meta: { colOrder: colOrder }, rowId: "id" });
  });
});


/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{column:string,order:ASC|DESC|nul}}} req.body
 */
router.get("/aftercolumnsort", function (req, res, next) {
  let sort = {
    column: req.query.column,
    order: req.query.order
  }
  if (sort.column !== 'undefined') {
    if (sort.order === 'true') {
      sort.order = 'ASC'
    } else if (sort.order === 'false') {
      sort.order = 'DESC'
    } else {
      sort.order = ''
    }
  }

  db.serialize(function () {
    db.all("SELECT * FROM `data` ORDER BY " + sort.column + " " + sort.order, (err, rows) => {
      if (rows) {
        res.json({ data: rows })
      }
    })
  })
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{columns:array,target:number}}} req.body
 */
router.post("/aftercolumnmove", jsonParser, function (req, res, next) {
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


router.get("/afterfilter", jsonParser, function (req, res, next) {
  var queries = req.query
  let dbQuery = 'SELECT * FROM \`data\` WHERE '
  for (let query in queries) {
    var col_name = query
    let options = queries[query]
    let i = 0
    for (let option in options) {
      let params = options[option]
      switch (option) {
        case "empty":
          dbQuery += "`" + col_name + "` IS NULL"
          break;
        case "not_empty":
          dbQuery += "`" + col_name + "` IS NOT NULL"
          break;
        case "eq":
          dbQuery += "`" + col_name + "` LIKE '" + params + "'"
          break;
        case "neq":
          dbQuery += "`" + col_name + "` NOT LIKE '" + params + "'"
          break;
        case "by_value":
          if (typeof params === 'string') {
            dbQuery += "`" + col_name + "` = '" + params + "'"
          } else {
            dbQuery += "`" + col_name + "` IN ("
            for (let i = 0; i < params.length; i++) {
              dbQuery += "'" + params[i] + "',"
            }
            dbQuery = dbQuery.slice(0, -1)
            dbQuery += ")"
          }
          break;
        case "begins_with":
          dbQuery += "`" + col_name + "` LIKE '" + params + "%' "
          break;
        case "ends_with":
          dbQuery += "`" + col_name + "` LIKE '%" + params + "' "
          break;
        case "contains":
          dbQuery += "`" + col_name + "` LIKE '%" + params + "%' "
          break;
        case "not_contains":
          dbQuery += "`" + col_name + "` NOT LIKE '%" + params + "%' "
          break;
      }
      if (option !== 'operator' && options.operator && i < options.operator.length) {
        if (typeof options.operator === 'string') {
          dbQuery += " " + options.operator
          i = options.operator.length
        } else {
          dbQuery += " " + options.operator[i] + " "
          i++
        }
      }
      var lastKey = Object.keys(queries)[Object.keys(queries).length - 1]
      if (col_name !== lastKey) {
        dbQuery += " and "
      }
    }
  }
  db.serialize(() => {
    db.all(dbQuery, (err, rows) => {
      res.json({ data: rows || [] })
    })
  })
})

router.get("/settings", jsonParser, function (req, res, next) {
  res.json({ data: settings });
});

router.get("/", function(req, res){
  res.render('index')
});

//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router;