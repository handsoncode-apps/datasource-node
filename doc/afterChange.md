To use this metod plese insert your code in TODO section in your controller.
Exemple code is shown below:

```
router.post('/afterchange', jsonParser, function (req, res, next) {
  let change = req.body.changes[0];
  data[change.row][change.column] = change.newValue;
  res.json({'data': change})
})

```
You can use generator-hot to automaticly add section.