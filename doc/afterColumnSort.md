# afterColumnSort event handling

You need to create method that will catch the POST "/aftercolumnsort" url with body param `tmp` object, and should return `200` OK HTTP response. 

```javascript
router.post('/aftercolumnsort', jsonParser, function (req, res, next) {
  let tmp = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})
```

`tmp` is an object defined by schema:

```javascript 

   { 
     column:string,
     order:ASC|DESC|null
   }
```

column is the column name passed in colName variable in your controller.
order is a type of sorting, ascending, descending or null.