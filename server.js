var credential = require('./credential'),
  http = require("http"),
  validator = require('validator'),
  url = require('url'),
  mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var dbCon = 'mongodb://' + credential.mlab() + '@ds145997.mlab.com:45997/cjs-sandbox';      

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var path = url.parse(req.url, true).path,
    response = '';
  MongoClient.connect(dbCon, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
      response = "{error: service is temporarally unavailable}";
    } else {
      if (/^\/new\//.test(path)) {
        var URL = path.substr(5);
        console.log('Add: ' + URL);
        if( validator.isURL(URL) ){
          var insertString = [{shorturl: genURL()}];
          console.log('Mongo: ' + insertString)
          insertDocument(db, insertString, function(result){
            console.log('callback: ' + result);
          })
        } else {
          response = "{error: url was not valid}";
        }
      } else {
        var URL = path.substr(1);
        console.log('Check: ' + URL);
        if( validator.isAlphanumeric(URL) ){
          console.log('retrieve from database')
        } else {
          response = "{error: redirect is not valid}";
        }
    
      }
      console.log('Connection established to', url);
      db.close();
    }
  });
}).listen(process.env.PORT || 8080);

var findDocument = function(db, str, callback) {
  var collection = db.collection('documents');
  collection.findOne(str, function(err, result) {
    (err != null) ? callback(err) : callback(result);
  });
}

var insertDocument = function(db, str, callback) {
  var collection = db.collection('documents');
  collection.insertMany(str, function(err, result) {
    (err != null) ? callback(err) : callback(result);
  });
}

var genURL = function() {
  var url = Math.random().toString(36).slice(2,6);
  // findDocument(db, url, function(result){
  //   if(result == '') {
  //     return url;
  //   } else {
  //     return genURL();
  //   }
  // });
  return url;
}