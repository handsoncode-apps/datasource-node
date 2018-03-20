# Data publishing

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

## Data filtering

You can filter passed data by columns and get object that is an array of objects handling information about filtered columns and methods of filtering. 

```javascript
router.get('/data', function (req, res, next) {
  // save filters for usage
  var filters = req.query.filters
  // TODO implement your code here
  res.json(data)
})
```

`filters` is an object defined by schema:

```javascript
  {
    column: string
    conditions: array
  }
```  
`conditions` property is an array of objects defined by schema:

```javascript
  {
    name: string
    args: array
  }
```

`args` property is an array which contains either string or object depends on `name` value.
Possible values of `name` property:

- "eq" - is equal to
- "neq" - is not equal to
- "empty" - is empty
- "not_empty" - is not empty
- "begins_with" - begins with
- "ends_with" - ends with
- "contains" - contains
- "not_contains" - does not contain
- "by_value" - by chosen values. In this case `args` array contains object where values of properties are chosen values. Example:

```json
args:
    [
      {
        "[0]": "chosen value 1",
        "[1]": "chosen value 2",
        "[2]": "chosen value 3"
      }
    ]
```    
On any other `name` value, `args` array contains single string element.Example:

 ```json
args:
    [
      "filter text"
    ]
```    


## Data sorting

You can sort passed data by columns and get object handling information about sorted columns.

```javascript
router.get('/data', function (req, res, next) {
  // save columns and order for usage
  var sortedColumn = req.column
  var columnOrder = req.order
  res.json(data)
})
```

req.query is an object defined by schema:

```javascript 
   { 
     column:string,
     order:ASC|DESC|null
   }
```