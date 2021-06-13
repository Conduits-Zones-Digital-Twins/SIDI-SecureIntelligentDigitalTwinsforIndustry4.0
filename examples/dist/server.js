"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var server = Net.createServer();
server.maxConnections = 10;
server.on('close', function () {
    console.log('Server closed !');
});
server.on('connection', function (socket) {
    console.log('Buffer size : ' + socket.bufferSize);
    console.log('---------server details -----------------');
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
    var lport = socket.localPort;
    var laddr = socket.localAddress;
    console.log('Server is listening at LOCAL port' + lport);
    console.log('Server LOCAL ip :' + laddr);
    console.log('------------remote client info --------------');
    var rport = socket.remotePort;
    var raddr = socket.remoteAddress;
    var rfamily = socket.remoteFamily;
    console.log('REMOTE Socket is listening at port' + rport);
    console.log('REMOTE Socket ip :' + raddr);
    console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);
    console.log('--------------------------------------------');
    server.getConnections(function (error, count) {
        console.log('Number of concurrent connections to the server : ' + count);
    });
    socket.setEncoding('utf8');
    socket.setTimeout(800000, function () {
        console.log('Socket timed out');
    });
    socket.on('drain', function () {
        console.log('write buffer is empty now .. u can resume the writable stream');
        socket.resume();
    });
    console.log('client connected');
    socket.write('TCP packet from server\r\n');
    socket.on('data', function (data) {
        var bread = socket.bytesRead;
        var bwrite = socket.bytesWritten;
        console.log('Bytes read : ' + bread);
        console.log('Bytes written : ' + bwrite);
        console.log('Data sent to server : ' + data);
        var is_kernel_buffer_full = socket.write('SERVER: I have received - ' + data);
        if (is_kernel_buffer_full) {
            console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
        }
        else {
            socket.pause();
        }
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
    host: 'localhost',
    port: 8124,
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
//# sourceMappingURL=server.js.map