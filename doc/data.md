# Data 

## Data publishing for datasource-connector

If you want send data to your frontend hot table please implement this method 

```javascript
router.get('/data', function (req, res, next) {
  res.json(data)
})
```

The schema of data response is: 

```javascript
{
  "data": [
    {"key1":value1,"key2":value2 (..)}
    ],
  "rowId":"id"

}
```
Where:

`Data` is an array of object represents each row:

- `key1`, `key2` - Database names of column name 
- `value1`, `value2` -  Database values for each cell

There may be more columns in this object, but all need to have unique name.

`rowId` is the of unique id column name.

## Filtering

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


## Sorting

You can sort passed data by columns and get object handling information about sorted columns.

```javascript
router.get('/data', function (req, res, next) {
  // save columns and order for usage
  var sortedColumn = req.column
  var columnOrder = req.order
  res.json(data)
})
```

Where `column` is string and `order` is Boolean with true if Ascending. Both parameters will be passed by `datasource-connector` in the same time.

Data sorting and filtering may be provided to backend in the same time, but it is not necessary.