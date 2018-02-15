To use this metod plese insert your code in your controller.
Exemple code is shown below:

```
router.post('/aftercreaterow', jsonParser, function (req, res, next) {
  let createRow = req.body
  for (let i = 0; i < createRow.amount; i++) {
    data.splice(req.body.index, 0, [])
  }
})
```
You can use generator-hot to automaticly add this section.