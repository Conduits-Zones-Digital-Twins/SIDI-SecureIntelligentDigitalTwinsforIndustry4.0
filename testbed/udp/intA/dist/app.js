"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = require("dgram");
var data_crypto_1 = require("data-crypto");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
var server_ip_r1 = (DOCKER) ? "10.0.0.13" : "192.168.1.113";
var my_port = 41234;
var server_port_r1 = 41234;
var _secret = "depl0yit";
var client_r1 = dgram.createSocket('udp4');
var server = dgram.createSocket('udp4');
server.on('error', function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});
server.on('message', function (pkt, rinfo) {
    console.log("--------------------------------------------------");
    var pkt_as_string = pkt.toString();
    var packet_parsed = JSON.parse(pkt_as_string);
    packet_parsed["content_encripted"] = data_crypto_1.TripleDes.encrypt(packet_parsed["content_encripted"], _secret);
    var pkt_as_string_to_send = JSON.stringify(packet_parsed);
    client_r1.send(pkt_as_string_to_send, 0, pkt_as_string_to_send.length, server_port_r1, server_ip_r1, function (err) {
    });
});
server.on('listening', function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});
server.bind(my_port);
//# sourceMappingURL=app.js.map