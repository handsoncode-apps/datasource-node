"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

// create application/json parser
const jsonParser = bodyParser.json();


/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{changes:[{row:number,column:number,newValue:string,meta:{row:number,col:number,visualRow:number,visualCol:number,prop:number,row_id:number,col_id:any}}], source:String}} req.body
 */
router.post("/update", jsonParser, function (req, res, next) {
  //TODO: cell update(s) action
  res.json({ data: "ok" });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createRow:{index:number,amount:number,source:string}}} req.body
 */
router.post("/create/row", jsonParser, function (req, res, next) {
  // TODO: new row action
});

router.post("/remove/row", jsonParser, function(req, res, next) {
  // TODO: remove row action
  res.json({ data: "ok" });
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{rowMove:{rowsMoved:array,target:number}}} req.body
 */
router.post("/move/row", jsonParser, function(req, res, next) {
  // TODO: move row action 
  res.json({data:'ok'});
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createCol:{index:number,amount:number,source:string}}} req.body
 */
router.post("/create/column", jsonParser, function (req, res, next) {
  // TODO: create new row action 
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{sort:[{key:string,values[any]}], filter:[key:string,value:string]}} req.query
 */
router.post("/data", jsonParser, function (req, res, next) {
  // TODO: publish data action (including sorting and filtering)
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{tmp:{columns:array,target:number}}} req.body
 */
router.post("/move/column", jsonParser, function (req, res, next) {
  let colOrder = []

  // TODO: columns order action 
  res.json({ data: colOrder });
});

router.get("/settings", jsonParser, function (req, res, next) {
  let settings = [];
  // TODO: HOT global settings publishing 
  res.json({ data: settings });
});

router.get("/", function(req, res){
  res.render('basic')
});

router.post("/remove/column", jsonParser, function (req, res, next) {
  // TODO: remove column(s) action
})

module.exports = router;
