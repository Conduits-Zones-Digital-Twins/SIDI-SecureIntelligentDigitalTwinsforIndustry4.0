"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var mqttClient = require("mqtt");
var mqttConnection = require("mqtt-connection");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.13" : "192.168.1.113";
var server_ip_r1 = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var my_port = 1883;
var server_port_r1 = 1883;
var _secret = "depl0yit";
var my_clientId = "intB_" + my_ip;
var topic_name = "smart_routing_01";
var client_r1_connection_options = {
    port: server_port_r1,
    clientId: my_clientId
};
var client_r1 = mqttClient.connect("mqtt://" + server_ip_r1, client_r1_connection_options);
client_r1.on('connect', function () {
    client_r1.subscribe(topic_name, function (err) {
        if (!err) {
            console.log("client_r1 successfully subscribed");
        }
    });
});
client_r1.on('message', function (topic, message) {
    console.log(message.toString());
});
var server = Net.createServer();
server.on('connection', function (stream) {
    var client = mqttConnection(stream);
    client.on('connect', function (packet) {
        client.connack({ returnCode: 0 });
    });
    client.on('publish', function (packet) {
        console.log("--------------------------------------------------");
        console.log("received", packet);
        console.log("received payload", JSON.parse(packet.payload.toString()));
        var pkt_as_string = packet.payload.toString();
        client_r1.publish(topic_name, Buffer.from(pkt_as_string));
    });
    client.on('pingreq', function () {
        client.pingresp();
    });
    client.on('subscribe', function (packet) {
        client.suback({ granted: [packet.qos], messageId: packet.messageId });
    });
    stream.setTimeout(1000 * 60 * 5);
    client.on('close', function () { client.destroy(); });
    client.on('error', function () { client.destroy(); });
    client.on('disconnect', function () { client.destroy(); });
    stream.on('timeout', function () { client.destroy(); });
});
server.listen(my_port, function () { console.log("listening"); });
//# sourceMappingURL=app.js.map