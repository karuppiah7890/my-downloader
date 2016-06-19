var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var express = require('express');
var app = express();

function DownloadRequest(options,userres) {

    var req = http.request(options,function(res){

        if(res.statusCode==200) {

          if(res.headers.hasOwnProperty('accept-ranges'))
          console.log(res.headers,typeof res.headers,res.statusCode);

          userres.set(res.headers);

          if(res.headers['content-type']==='application/octet-stream')
          userres.type(path.extname(options.path));

          res.pipe(userres);
        }

        else if(res.statusCode==302) {

          console.log('Calling DownloadRequest() with ',options);
          var URL = url.parse(res.headers.location);

          options = {
            hostname : URL.hostname,
            path : URL.pathname,
            method : 'GET'
          };

          DownloadRequest(options,userres);
        }
    });

    req.end();

}

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {

  if(!request.query.myurl)
  {
    response.end();
    return;
  }

  var URL = url.parse(request.query.myurl);

  var options = {
    hostname : URL.hostname,
    path : URL.pathname,
    method : 'GET'
  };

  DownloadRequest(options,response);

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
