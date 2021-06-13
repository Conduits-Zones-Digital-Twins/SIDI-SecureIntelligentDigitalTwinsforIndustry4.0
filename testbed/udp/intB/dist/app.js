"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = require("dgram");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.13" : "192.168.1.113";
var server_ip_r1 = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var my_port = 41234;
var server_port_r1 = 41234;
var client_r1 = dgram.createSocket('udp4');
var server = dgram.createSocket('udp4');
server.on('error', function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});
server.on('message', function (pkt, rinfo) {
    console.log("--------------------------------------------------");
    var pkt_as_string = pkt.toString();
    client_r1.send(pkt_as_string, 0, pkt_as_string.length, server_port_r1, server_ip_r1, function (err) {
    });
});
server.on('listening', function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});
server.bind(my_port);
//# sourceMappingURL=app.js.map