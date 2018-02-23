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
     newValue:any,
     meta:{
       row:number,
       col:number,
       visualRow:number,
       visualCol:number,
       prop:number,
       row_id:number,
       col_id:any
     }
   }
  ],
  source: string
 }
```
change is the array of objects you get after changing values of one or few cells. One object defines change of one cell value and includes metadata of this object.