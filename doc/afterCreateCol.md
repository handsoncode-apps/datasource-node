#afterCtreateCol event handling

To use this metod plese implement in your controller.
Exemple code is shown below:

```javascript
router.post('/aftercreatecol', jsonParser, function (req, res, next) {
  let createCol = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})
```
createCol {index:number, amount:number, source:string} is an object that you get after adding new columns in source HOT table.