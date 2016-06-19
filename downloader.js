var http = require('http');
var fs = require('fs');
var url = require('url');

var link = 'releases.ubuntu.com';
var link_path = '/16.04/ubuntu-16.04-desktop-amd64.iso';

//var size = 5000000;

var options = {
  hostname : link,
  path : link_path,
  method : 'GET'
  /*headers : {
    'Range': `bytes=0-${size}`
  }*/
};

function DownloadRequest(options,stream) {

    var req = http.request(options,function(res){

        if(res.statusCode==200) {

          if(res.headers.hasOwnProperty('accept-ranges'))
          console.log(res.headers,typeof res.headers,res.statusCode);

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


var stream = fs.createWriteStream('ok.iso');

console.log('Calling DownloadRequest() with ',options);
DownloadRequest(options,stream);
