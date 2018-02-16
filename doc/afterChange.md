# afterChange event handling 

To use this method plese insert into your controller.
Exemple code is shown below:

```javascript
router.post('/afterchange', jsonParser, function (req, res, next) {
  let change = req.body;

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})

```

change {row:number, column:number, oldValue:any, newValue:any}
is an object that you get after changing value in HOT table cell.