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


//server.listen(process.env.PORT || port);
app.listen(port, () => console.log('listening on ' + port));

app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname + '/public/frontPage.html'));

  console.log('AFTER sendFile');

  client.query('SELECT SELECT DISTINCT code FROM medication' +
                ' WHERE patient = \'71949668-1c2e-43ae-ab0a-64654608defb\'', (err, results) => {
    if (err) {
      throw err
    }

    console.log("console logging "+ JSON.stringify(results.rows));
  })

});


const userAction = async () => {
  const response = await fetch('http://example.com/movies.json');
  const myJson = await response.json(); //extract JSON from the http response
  // do something with myJson
}
