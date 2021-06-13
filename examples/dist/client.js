"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var client = Net.createConnection({ port: 8124 }, function () {
    console.log('connected to server!');
    client.write('CLIENT: TCP packet from client!\r\n');
});
client.setEncoding('utf8');
client.on('error', function (err) {
    throw err;
});
client.on('data', function (data) {
    console.log(data.toString());
});
client.on('end', function () {
    console.log('disconnected from server');
});
//# sourceMappingURL=client.js.map