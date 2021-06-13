"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = require("dgram");
var fs = require("fs");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var my_port = 41234;
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
    fs.appendFileSync(file_name, "index,seq_number,content_encripted,high_security,n_forwards,destination,timestamp_sent,timestamp_received,current_pkt_frequency,latency,l_1,l_2");
    for (var i in received_pkts_buffer) {
        var row = received_pkts_buffer[i];
        var latency = Number(row["timestamp_received"]) - Number(row["timestamp_sent"]);
        var l_1 = (row["high_security"]) ? "" : latency;
        var l_2 = (!row["high_security"]) ? "" : latency;
        fs.appendFile(file_name, "\n" + i + "," + row["seq_number"] + "," + row["content_encripted"] + "," + row["high_security"] + "," + row["n_forwards"] + "," + row["destination"] + "," + row["timestamp_sent"] + "," + row["timestamp_received"] + "," + row["current_pkt_frequency"] + "," + latency + "," + l_1 + "," + l_2, function (err) {
            if (err)
                throw err;
            console.log("row" + i + " ok");
        });
    }
};
var server = dgram.createSocket('udp4');
var counter_pkt = 0;
server.on('error', function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});
server.on('message', function (pkt, rinfo) {
    console.log("--------------------------------------------------");
    var pkt_as_string = pkt.toString();
    if (pkt_as_string === "_END_OF_DIALOG_") {
        console.log("received payload end of dialog mex: ", pkt_as_string);
        server.close();
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
            console.log("received ", counter_pkt);
            packet_parsed["timestamp_received"] = Date.now();
            received_pkts_buffer.push(packet_parsed);
        }
    }
    console.log("done pkt");
});
server.on('listening', function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});
server.bind(my_port);
//# sourceMappingURL=app.js.map