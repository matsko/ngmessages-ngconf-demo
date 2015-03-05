var fs = require("fs");
var express = require('express');
var _ = require('underscore');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json())
app.post('/submit', function(req, res) {

  var data = req.body;
  var errors = validateData(data);
  if (errors && errors.length) {
    res.json({ status: 'fail', errors: errors });
  } else {
    res.json({ status: 'ok' });
  }
});

module.exports = app;

function equals(a,b) {
  return a.toLowerCase() === b.toLowerCase();
}

function validateData(data) {
  var db = JSON.parse(fs.readFileSync("./db.json", "utf8"));
  var maxIndex;
  var maxValue;

  _.each(db, function(entry, index) {
    var count = 0;
    _.each(entry, function(value, key) {
      var inputValue = data[key];
      if (!inputValue || equals(inputValue, value)) {
        count++;
      }
    });

    if (maxIndex === undefined || count > maxValue) {
      maxIndex = index;
      maxValue = count;
    }
  });

  return populateErrors(data, db[maxIndex || 0]);
}

function populateErrors(inputData, targetData) {
  var errors = [];
  _.each(targetData, function(value, key) {
    var otherValue = inputData[key];
    if (!equals(value, otherValue)) {
      errors.push({
        message: 'Your ' + key + ' doesn\'t match any of our records',
        type: key,
        field: key
      });
    }
  });

  return errors;
}
