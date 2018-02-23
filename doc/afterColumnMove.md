# afterColumnMove event handling

You need to create method that will catch the POST "/aftercolumnmove" url with body param `tmp` object, and should return `200` OK HTTP response. 

```javascript
router.post('/aftercolumnmove', jsonParser, function (req, res, next) {
  let colMoved = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})
```

`colMoved` is an object defined by schema:

```javascript 

   { 
     columns: array,
     target: number
   }
```

columns is an array of columns indexes that has changed positions after 
moving.

target is an array index where columns has been moved.