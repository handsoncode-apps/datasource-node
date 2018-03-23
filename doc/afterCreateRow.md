# afterCreateRow event handling

You need to create method that will catch the POST "/aftercreaterow" url with body param `createRow` object, and should return `200` OK HTTP response. 

```javascript
router.post('/create/row', jsonParser, function (req, res, next) {
  var createRow = req.body

  // TODO  insert implementation here
  res.json({'data': 'ok'})
  }
})
```
`createRow` is object defined by this schema:

```javascript
{
  index:number,
  amount:number,
  source:string
}
``` 