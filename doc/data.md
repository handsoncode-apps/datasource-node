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
  ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
  ['2017', 10, 11, 11, 15, 15, 16],
  ['2018', 13, 11, 12, 14, 15, 16],
  ['2019', 10, 11, 13, 9, 15, 16],
  ['2020', 10, 11, 14, 12, 15, 16],
  ['2021', 10, 11, 15, 11, 15, 16]
];
```
Data is an array of arrays. Each array is a row where values begins on index 0 and represents subsequent columns.
