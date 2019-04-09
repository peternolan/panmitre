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

  console.log('AFTER sendFile');
});

app.get('/getPatients', function (req, res) {
  console.log('getPatients');
  client.query('SELECT DISTINCT patient FROM medication;', (err, results) => {
    if (err) {
      throw err
    }


    console.log("console logging "+ JSON.stringify(results.rows));
    //send the data
    send(res, JSON.stringify(results.rows));
  });

});

app.post('/getCodes',  bodyParser.json(), function (req, res) {

  client.query('SELECT DISTINCT code FROM medication WHERE patient = \'' + req.body["patient"] +'\'', (err, results) => {
    if (err) {
      throw err
    }

    console.log("console logging "+ JSON.stringify(results.rows));
    //send the data
    send(res, JSON.stringify(results.rows));
  });



});


