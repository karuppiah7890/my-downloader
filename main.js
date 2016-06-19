var http = require('http');
var fs = require('fs');
var url = require('url');

var link = 'releases.ubuntu.com';
var link_path = '/16.04/ubuntu-16.04-desktop-amd64.iso';

var options = {
  hostname : link,
  path : link_path,
  method : 'GET'
};

var express = require('express');
var app = express();

function DownloadRequest(options,stream) {

    var req = http.request(options,function(res){

        if(res.statusCode==200) {

          if(res.headers.hasOwnProperty('accept-ranges'))
          console.log(res.headers,typeof res.headers,res.statusCode);

          stream.set(res.headers);
          res.pipe(stream);
        }

        else if(res.statusCode==302) {
          console.log('Calling DownloadRequest() with ',options);
          var URL = url.parse(res.headers.location);

          options = {
            hostname : URL.hostname,
            path : URL.pathname,
            method : 'GET'
          };

          DownloadRequest(options,stream);
        }
    });

    req.end();

}

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {

  DownloadRequest(options,response);

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
