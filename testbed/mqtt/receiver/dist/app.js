"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var mqttConnection = require("mqtt-connection");
var fs = require("fs");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var my_port = 1883;
var _secret = "depl0yit";
var received_pkts_buffer = [];
var createReport = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var s = today.getSeconds();
    var file_name = hh + "_" + min + "_" + s + "_" + dd + "_" + mm + "_" + yyyy + ".csv";
    fs.appendFileSync(file_name, "seq_number,content_encripted,high_security,n_forwards,destination,timestamp_sent,timestamp_received,latency");
    for (var i in received_pkts_buffer) {
        var row = received_pkts_buffer[i];
        var latency = Number(row["timestamp_received"]) - Number(row["timestamp_sent"]);
        fs.appendFile(file_name, "\n" + row["seq_number"] + "," + row["content_encripted"] + "," + row["high_security"] + "," + row["n_forwards"] + "," + row["destination"] + "," + row["timestamp_sent"] + "," + row["timestamp_received"] + "," + latency, function (err) {
            if (err)
                throw err;
            console.log("row" + i + " ok");
        });
    }
};
var server = new Net.Server();
var counter_pkt = 0;
server.on('connection', function (stream) {
    var client = mqttConnection(stream);
    client.on('connect', function (packet) {
        client.connack({ returnCode: 0 });
    });
    client.on('publish', function (packet) {
        console.log("--------------------------------------------------");
        var pkt_as_string = packet.payload.toString();
        if (counter_pkt >= 1000) {
            console.log("received payload end of dialog mex: ", pkt_as_string);
            server.close();
            client.destroy();
            createReport();
        }
        else {
            var packet_parsed = false;
            counter_pkt++;
            try {
                packet_parsed = JSON.parse(pkt_as_string);
            }
            catch (error) { }
            if (packet_parsed) {
                console.log("received payload", counter_pkt);
                packet_parsed["timestamp_received"] = Date.now();
                received_pkts_buffer.push(packet_parsed);
            }
        }
        console.log("done pkt");
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