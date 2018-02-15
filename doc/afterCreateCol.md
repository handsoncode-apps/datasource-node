To use this metod plese insert your code in your controller.
Exemple code is shown below:

```
router.post('/aftercreatecol', jsonParser, function (req, res, next) {
  let createCol = req.body
  for (let i = 0; i < data.length; i++) {
    data[i].splice([createCol.index], 0, '')
  }
})
```
You can use generator-hot to automaticly add this section.