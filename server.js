var credential = require('./credential'),
  http = require("http"),
  validator = require('validator'),
  url = require('url'),
  mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var dbCon = 'mongodb://' + credential.mlab + '@ds145997.mlab.com:45997/cjs-sandbox';      


http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var path = url.parse(req.url, true).path,
    response = '';
  if (/^\/new\//.test(path)) {
    var URL = path.substr(5);
    console.log(URL);
    if( validator.isURL(URL) ){
      console.log('add to database')
    } else {
      response = "{error: url was not valid}";
    }
  } else {
    var URL = path.substr(1);
    console.log(URL);
    if( validator.isAlphanumeric(URL) ){
      console.log('retrieve from database')
    } else {
      response = "{error: redirect is not valid}";
    }

  }
}).listen(process.env.PORT || 8080);

function storeInDb(){
  MongoClient.connect(dbCon, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      db.close();
    }
  });
}

function retrieveFromDb(){
  MongoClient.connect(dbCon, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      db.close();
    }
  });
}