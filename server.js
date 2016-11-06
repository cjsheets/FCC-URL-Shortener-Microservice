require('credential');
var http = require("http");  
const url = require('url');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://' + credential + '@ds145997.mlab.com:45997/cjs-sandbox';      


http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var objUrl = url.parse(req.url, true),
  console.log(objUrl);
}).listen(process.env.PORT || 8080);

function checkDb(){
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      db.close();
    }
  });
}