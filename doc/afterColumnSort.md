#afterColumnSort event handling

To use this method plese insert into your controller.
Exemple code is shown below:

```javascript
router.post('/aftercolumnsort', jsonParser, function (req, res, next) {
  let tmp = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})
```
tmp is an object {column:number, order:boolean} that you get after sorting columns.