"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.13" : "192.168.1.113";
var server_ip_r1 = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var my_port = 8225;
var server_port_r1 = 8225;
var client_r1 = Net.createConnection({ port: server_port_r1, host: server_ip_r1 }, function () {
    console.log('connected to server [' + server_ip_r1 + ']!');
});
client_r1.setEncoding('utf8');
client_r1.on('error', function (err) {
    throw err;
});
client_r1.on('data', function (data) {
    console.log(data.toString());
});
client_r1.on('end', function () {
    console.log('client_r1 disconnected from server');
});
var server = Net.createServer();
server.maxConnections = 10;
server.on('close', function () {
    console.log('Server closed !');
});
server.on('connection', function (socket) {
    socket.setEncoding('utf8');
    socket.setTimeout(800000, function () {
        console.log('Socket timed out');
    });
    socket.on('data', function (data) {
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Data sent to server : ' + data);
        client_r1.write(JSON.stringify(data));
    });
    socket.on('drain', function () {
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });
    socket.on('timeout', function () {
        console.log('Socket timed out !');
        socket.end('Timed out!');
    });
    socket.on('error', function (error) {
        console.log('Error : ' + error);
    });
    socket.on('end', function () {
        console.log('client disconnected');
    });
    socket.on('close', function (error) {
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Socket closed!');
        if (error) {
            console.log('Socket was closed coz of transmission error');
        }
    });
});
server.on('error', function (err) {
    console.log('Error: ' + err);
    throw err;
});
server.listen({
    host: my_ip,
    port: my_port,
    exclusive: true
}, function () {
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
});
var islistening = server.listening;
if (islistening) {
    console.log('Server is listening');
}
else {
    console.log('Server is not listening');
}
setTimeout(function () {
    server.close();
}, 5000000);
//# sourceMappingURL=app.js.map