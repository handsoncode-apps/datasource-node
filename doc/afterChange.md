# afterChange event handling 

You need to create method that will catch the POST "/afterchange" url with body param `change` object, and should return `200` OK HTTP response. 


Express.js example : 
```javascript
router.post('/afterchange', jsonParser, function (req, res, next) {
  let change = req.body;

  // TODO  insert implementation here
  res.json({'data': 'ok'})
})

```

`change` is object defined by this schema:

```javascript 
{
  changes:[
   { 
     row:number, 
     column:any, 
     oldValue:any, 
     newValue:any
   }
  ],
  source: string
 }
```
