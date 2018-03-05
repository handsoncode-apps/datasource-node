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
    column: 1
  },
  sortIndicator: true,
  filters: true,
  dropdownMenu: true,
};
var cellMeta = [];
var colOrder = ["first_name", "last_name", "age", "sex", "phone"];
var dataAtBeginning = data;

const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./database.db", function(data) {

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
        "CREATE TABLE IF NOT EXISTS `cellMeta` (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, rowId TEXT, colId TEXT, meta TEXT)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON settings (id)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS SETTINGS_INDEX ON data (phone)"
      );
      db.run(
        "CREATE UNIQUE INDEX IF NOT EXISTS USER_INDEX ON cellMeta (rowId)"
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
  

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{changes:[{row:number,column:number,newValue:string,meta:{row:number,col:number,visualRow:number,visualCol:number,prop:number,row_id:number,col_id:any}}], source:String}} req.body
 */

router.post("/afterchange", jsonParser, function(req, res, next) {
  
  let changes = req.body.changes
  
  for (let i = 0; i < changes.length; i++) {
    let rowId = changes[i].row
    let meta = changes[i].meta
    console.log(meta.row_id)
    console.log(meta.col_id)
    console.log(JSON.stringify(meta))    
    db.serialize(function(error) {
      let stmt =  db.prepare("UPDATE `data` SET " + changes[i].column + " = '" + changes[i].newValue + "' WHERE id = '" + rowId + "'");
      stmt.run()
      stmt.finalize()
    })
   
    db.all("SELECT * FROM `cellMeta` LIMIT 1", (err, rows) => {
      if (rows.length === 0) {
      db.serialize(function(error) {
        let stmt =  db.prepare("INSERT INTO `cellMeta` ('rowId', 'colId', 'meta') VALUES (?, ?, ?)");
        stmt.run('rowId', 'colId' , 'meta');
        db.prepare("UPDATE `cellMeta` SET meta  = '" + JSON.stringify(meta) + "' WHERE rowId = '" + meta.row_id + "' AND colId = '" + meta.col_id + "'");
        stmt.run()
        stmt.finalize()
      })
    }})  

  res.json({ data: "ok" });
  };s
});

})
/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createRow:{index:number,amount:number,source:string}}} req.body
 */
router.post("/aftercreaterow", jsonParser, function(req, res, next) {
  var createRow = req.body;
  var values = [];
  db.serialize(function() {
    let stmt = db.prepare("INSERT INTO `data` (`first_name`, `last_name`,`age`,`sex`,`phone`) VALUES ('', '', '', '', '')")
    stmt.run()
    stmt.finalize()
  })
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createCol:{index:number,amount:number,source:string}}} req.body
 */
router.post("/aftercreatecol", jsonParser, function(req, res, next) {
  var createCol = req.body;
  colNames.splice(createCol.index, 0, "");
  db.serialize(function() {
    let stmt = db.prepare("alter table `data` add column testy TEXT")
    stmt.run()
    stmt.finalize()
  })
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
})
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
  //  else {
  //   res.json({data: []})
  // }

  var tempCol = [];
  var indexes = [];
  
  db.serialize(function() {
    db.all("SELECT * FROM `data` ORDER BY " + sort.column + " " + sort.order, (err, rows) => {
      if (rows) {
        res.json({data: rows})
      }
    })
  })

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


router.get("/afterfilter", jsonParser, function(req, res, next) {
  var queries = req.query
  let dbQuery = 'SELECT * FROM \`data\` WHERE '
  for (let query in queries) {
    var col_name = query
    let options = queries[query]
    for (let option in options) {
      let params = options[option]
      if (option === 'not_empty') {
        dbQuery += "`" + col_name + "` IS NOT NULL OR "
      } else if (option === 'by_value') {
        for (let i = 0; i < params.length; i++) {
          dbQuery += "`" + col_name + "` = '" + params[i] + "'"
          if (i !== params.length - 1) {
            dbQuery += " OR "
          }
        }
      }
    }
  }
  db.serialize(() => {
    db.all(dbQuery, (err, rows) => {
      res.json({data: rows})
    })
  })
})

router.get("/settings", jsonParser, function(req, res, next) {
  res.json({ data: settings });
});
//TODO onDestroy => dataAtBeginning = data or smth like this
module.exports = router;