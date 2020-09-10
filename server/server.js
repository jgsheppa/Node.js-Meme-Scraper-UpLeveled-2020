const http = require('http');
const fs = require('fs');
const path = require('path');

http
  .createServer(function (request, response) {
    console.log('request ', request.url);

    let filePath = '.' + request.url;
    if (filePath == './') {
      filePath = './public/index.html';
    }

    let extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == 'ENOENT') {
          fs.readFile('./404.html', function (error, content) {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
          });
        } else {
          response.writeHead(500);
          response.end(
            'Sorry, check with the site admin for error: ' +
              error.code +
              ' ..\n',
          );
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  })
  .listen(8125);
console.log('Server running at http://127.0.0.1:8125/');

/*
const requestListener = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  express.static('./public/index.html');
  res.end();
};

// Listen
const port = process.env.PORT || 8080;
const server = http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Charades server listening on port ${port}`);
});*/
