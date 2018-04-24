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
router.post("/cell", jsonParser, function (req, res, next) {
  //TODO: cell update(s) action
  res.json({ data: "ok" });
});

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createRow:{index:number,amount:number,source:string}}} req.body
 */
router.put("/row", jsonParser, function (req, res, next) {
  // TODO: new row action
});

router.delete("/row", jsonParser, function(req, res, next) {
  // TODO: remove row action
  res.json({ data: "ok" });
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{rowMove:{rowsMoved:array,target:number}}} req.body
 */
router.post("/row/move", jsonParser, function(req, res, next) {
  // TODO: move row action
  res.json({data:'ok'});
})

/**
 * @param {{e.RequestHandler}} jsonParser
 * @param {{createCol:{index:number,amount:number,source:string}}} req.body
 */
router.put("/column", jsonParser, function (req, res, next) {
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
router.post("/column/move", jsonParser, function (req, res, next) {
  let colOrder = []

  // TODO: columns order action
  res.json({ data: colOrder });
});

router.get("/settings", jsonParser, function (req, res, next) {
  let settings = [];
  // TODO: HOT global settings publishing
  res.json({ data: settings });
});

router.delete("/column", jsonParser, function (req, res, next) {
  // TODO: remove column(s) action
});

router.post("/cell/meta", jsonParser, function (req, res, next) {
  // TODO: cell meta change action
});

router.post("/cell/merge", jsonParser, function (req, res, next) {
  // TODO: cell merge action
});

router.post("/cell/unmerge", jsonParser, function (req, res, next) {
  // TODO: cell merge action
});

module.exports = router;
