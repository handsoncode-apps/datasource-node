# afterCtreateCol event handling

You need to create method that will catch the POST "/aftercreatecol" url with body param `createCol` object, and should return `200` OK HTTP response.

```javascript
router.post('/aftercreatecol', jsonParser, function (req, res, next) {
  let createCol = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})
```
`createCol` is object defined by this schema:

```javascript
  {
    index:number,
    amount:number,
    source:string
  }
  ```