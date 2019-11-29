const http = require('http');
const fs = require('fs');

const port = 3000;

http.createServer((request, response) => {
  console.log(`Requested address: ${request.url}`);
  let filePath;
  if (request.url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = `public/${request.url}`;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.statusCode = 404;
      response.end('No data found!');
    } else {
      response.end(data);
    }
  });
}).listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
