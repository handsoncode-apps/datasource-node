#afterCreateRow event Handling

To use this metod plese implement in your controller.
Exemple code is shown below:

```javascript
router.post('/aftercreaterow', jsonParser, function (req, res, next) {
  let createRow = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
  }
})
```
createRow {index:number, amount:number, source:string} is an object that you get after adding new rows in source HOT table.