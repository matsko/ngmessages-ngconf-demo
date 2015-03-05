var express = require('express');

var app = express();

var api = require('./api/index');
var www = express.static(__dirname + '/www');

app.use('/', www);
app.use('/api', api);

app.listen(8888);
console.log('Running website at localhost:8888');
