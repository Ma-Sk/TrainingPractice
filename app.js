let http = require("http");
let fs = require("fs");
let port = 3000;

http.createServer(function (request, response) {

    console.log(`Requested adress: ${request.url}`);
    let filePath;
    if (request.url === '/') {
        filePath = "public/index.html";
    }
    else {
        filePath = 'public/' + request.url;
    }
    fs.readFile(filePath, function (error, data) {
        if (error) {
            response.statusCode = 404;
            response.end("No data found!");
        } else {
            response.end(data);
        }
    })
}).listen(port, () => {
    console.log('Server is listening at ' + port);
});