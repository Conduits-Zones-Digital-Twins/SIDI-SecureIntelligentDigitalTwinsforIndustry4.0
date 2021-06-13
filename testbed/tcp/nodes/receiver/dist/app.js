"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var fs = require("fs");
var DOCKER = false;
var my_ip = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var port = 8225;
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
        console.log(received_pkts_buffer["seq_number"]);
        var row = received_pkts_buffer[i];
        var latency = Number(row[i]["timestamp_received"]) - Number(row[i]["timestamp_sent"]);
        fs.appendFile(file_name, "\n" + row[i]["seq_number"] + ",\n          " + row[i]["content_encripted"] + ",\n          " + row[i]["high_security"] + ",\n          " + row[i]["n_forwards"] + ",\n          " + row[i]["destination"] + ",\n          " + row[i]["timestamp_sent"] + ",\n          " + row[i]["timestamp_received"] + ",\n          " + latency, function (err) {
            if (err)
                throw err;
            console.log("row" + i + " ok");
        });
    }
};
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
        if (data.includes("_EOS_")) {
            var data_arr = data.split("_EOS_")[0].split("_EOP_");
            for (var i in data_arr) {
                var packet_parsed = JSON.parse(data_arr[i].trim());
                packet_parsed["timestamp_received"] = Number(process.hrtime.bigint());
                received_pkts_buffer.push(packet_parsed);
            }
            socket.end('Last packet');
            socket.destroy();
            createReport();
        }
        else {
            var data_arr = data.split("_EOP_");
            for (var i in data_arr) {
                var packet_parsed = JSON.parse(data_arr[i].trim());
                packet_parsed["timestamp_received"] = Number(process.hrtime.bigint());
                received_pkts_buffer.push(packet_parsed);
            }
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
    host: my_ip,
    port: port,
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