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


/**
 * Brings the user to the home page, frontPage.html.
 */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/frontPage.html'));
});

/**
 * Used for getting patients who
 *  Have had encounters involving multiple drugs.
 *  Have had been using drugs during overlapping time frames
 */
app.get('/getPatients', function (req, res) {
  console.log('getPatients');
  client.query('SELECT DISTINCT patient FROM (SELECT Distinct m1.* ' +
    'FROM medication m1 INNER JOIN medication m2 ' +
    'ON (((m2.start > m1.start AND m2.start < m1.stop) ' +
    'AND (m1.encounter = m2.encounter)) ' +
    'OR (m1.start IS NOT NULL AND m2.stop IS NULL))) AS overlap;', (err, results) => {
    if (err) {
      throw err
    }

    //send the data
    send(res, JSON.stringify(results.rows));
  });

});

/**
 * Used for getting the codes of a particular patient, and eliminating
 * duplicates.
 */
app.post('/getCodes',  bodyParser.json(), function (req, res) {

  //req.body["patient"]

  client.query('SELECT DISTINCT code FROM medication WHERE patient = \'' + req.body["patient"] + '\';', (err, results) => {
    if (err) {
      throw err
    }
    //send the data
    send(res, JSON.stringify(results.rows));
  });

});
/**
 * Used for getting a list of names from the remaining patient ids that we
 * have confirmed have had drug-drug interactions
 */
app.post('/getName',  bodyParser.json(), function (req, res) {

  client.query('SELECT prefix, first, last, suffix FROM patients WHERE id = \'' + req.body["patient"] +'\'', (err, results) => {
    if (err) {
      throw err
    }

    console.log(JSON.stringify(results.rows));

    //send the data
    send(res, JSON.stringify(results.rows));
  });

});


