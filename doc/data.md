## Data publishing

If you want send data to your frontend hot table please implement this method 

```javascript
router.get('/data', function (req, res, next) {
  res.json(data)
})
```

example of data format is 

```javascript

var data = [
   {
    key: 5,
    values: ["2017", 10, 11, 11, 15, 15, 16]
  },
  {
    key: 7,
    values: ["2018", 13, 11, 12, 14, 15, 16]
  },
  {
    key: 11,
    values: ["2019", 10, 11, 13, 9, 15, 16]
  },
  {
    key: 13,
    values: ["2020", 10, 11, 14, 12, 15, 16]
  },
  {
    key: 15,
    values: ["2020", 10, 11, 14, 12, 15, 16]
  }
];
var colNames = ["year", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"];
var colOrder = [0, 1, 2, 3, 4, 5, 6];

```
**data** is an array of objects that represent each row in table. Objects have two properties: 
```
{
    key: int | string,
    values: any
}
``` 


**colNames** is an array of strings (columns names).

**colOrder** is an array of numbers (columns indexes that starts with 0 index).
