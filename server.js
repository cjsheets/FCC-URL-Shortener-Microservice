var credential = require('./credential'),
  http = require("http"),
  validator = require('validator'),
  url = require('url'),
  mongodb = require('mongodb'),
  nodeRes = require('node-res');

var MongoClient = mongodb.MongoClient;
var dbCon = 'mongodb://' + credential.mlab() + '@ds145997.mlab.com:45997/cjs-sandbox';      

http.createServer(function(req, res) {
  var path = url.parse(req.url, true).path,
    response = '';
  MongoClient.connect(dbCon, function (err, db) {
    if (err) {
      res.end("{error: service is temporarally unavailable}");
    } else {
      parseURL(db, path, function(result){
        db.close();
        if(result.redirect != undefined){
          console.log(result.redirect)
          nodeRes.redirect(301, 'http://www.google.com');
//          res.write('Redirecting to ' + result.redirect + '');
//          res.end();
        } else {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(JSON.stringify(result));
        }
      });
    }
  });
}).listen(process.env.PORT || 8080);

var parseURL = function(db, path, callback) {
  if (/^\/new\//.test(path)) {
    // Add new redirect
    var longURL = path.substr(5), shortURL = '';
    console.log('Add: ' + longURL);
    if( validator.isURL(longURL) ){
      genURL(db, function(shortURL){
        var insertString = [{shorturl: shortURL, fullurl: longURL},];
        console.log('Mongo Insert: ')
        console.log(insertString)
        insertDocument(db, insertString, function(result){
          if (result == null) {
           callback("{error: could not add url}");
          } else {
           callback("{success: url added, shortUrl: "+shortURL+"}");
          }
        });
      });
    } else {
      callback("{error: url was not valid}");
    }
  } else {
    // Check for existing redirect
    var longURL = path.substr(1);
    console.log(longURL);
    if( validator.isAlphanumeric(longURL) ){
      var findString = {shorturl: longURL};
      console.log('Mongo Find: ')
      console.log(findString)
      response = findDocument(db, findString, function(result){
        if (result == null) { 
          callback("{error: redirect was not found}");
        } else {
          callback({redirect: result.fullurl});
        }
      });
    } else {
      callback("{error: redirect is not valid}");
    }
  }
}
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

var genURL = function(db, callback) {
  var shortURL = Math.random().toString(36).slice(2,6);
  var findString = {shorturl: shortURL};
  findDocument(db, findString, function(result){
    if (result == null) {
      callback(shortURL)
    } else {
      genURL(db);
    }
  });
  
}