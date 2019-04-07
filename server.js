var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , SqlString = require('sqlstring')
  , port = 8080
  , debug = true;
var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var bcrypt = require('bcrypt');
var app = express();


//server.listen(process.env.PORT || port);
app.listen(port, () => console.log('listening on ' + port));

app.get('/', function (req, res) {

  res.sendFile(path.join(__dirname + '/public/frontPage.html'));

});


const userAction = async () => {
  const response = await fetch('http://example.com/movies.json');
  const myJson = await response.json(); //extract JSON from the http response
  // do something with myJson
}
