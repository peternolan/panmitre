var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , SqlString = require('sqlstring')
  , port = 8080
  , debug = true;
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var app = express();
var pg = require('pg');
var conString = "postgres://testing:test@localhost:5432/mitreDB";

var client = new pg.Client(conString);
client.connect();

function send (res, content) {
  res.writeHead(200, {'Content-Type' : 'text/html'});
  res.end(content, 'utf-8');
}
//server.listen(process.env.PORT || port);
app.listen(port, () => console.log('listening on ' + port));

app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname + '/public/frontPage.html'));
});

app.get('/getPatients', function (req, res) {
  console.log('getPatients');
  client.query('SELECT DISTINCT patient FROM medication;', (err, results) => {
    if (err) {
      throw err
    }
    //send the data
    send(res, JSON.stringify(results.rows));
  });

});

app.post('/getCodes',  bodyParser.json(), function (req, res) {

  console.log('getCodes');
  client.query('SELECT DISTINCT overlap.code FROM (SELECT m1.* FROM medication m1 ' +
    'INNER JOIN medication m2 ON m2.start > m1.start ' +
    'AND m2.start < m1.stop OR m2.stop IS NULL) AS overlap ' +
    'WHERE patient = \'' + req.body["patient"] + '\'', (err, results) => {
    if (err) {
      throw err
    }
    //send the data
    send(res, JSON.stringify(results.rows));
  });

});

app.post('/getName',  bodyParser.json(), function (req, res) {

  console.log('getName');
  client.query('SELECT prefix, first, last, suffix FROM patients WHERE id = \'' + req.body["patient"] +'\'', (err, results) => {
    if (err) {
      throw err
    }
    //send the data
    send(res, JSON.stringify(results.rows));
  });

});


