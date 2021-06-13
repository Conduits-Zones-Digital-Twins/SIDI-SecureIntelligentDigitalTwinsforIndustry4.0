"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mqttClient = require("mqtt");
var data_crypto_1 = require("data-crypto");
var Sleep = require("sleep");
var DOCKER = false;
var getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};
var my_ip = (DOCKER) ? "10.0.0.11" : "192.168.1.111";
var server_ip_r1 = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var server_ip_r2 = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
var server_port_r1 = 1883;
var server_port_r2 = 1883;
var my_clientId = "sender_" + my_ip;
var _secret = "depl0yit";
var topic_name = "smart_routing_01";
var lock1 = false;
var lock2 = false;
var generate_pkt = function (seq_number, destination_ip, high_security) {
    var content = Math.random().toString(36).substring(2);
    var pkt = {};
    pkt["destination"] = destination_ip;
    pkt["n_forwards"] = (destination_ip === server_ip_r1) ? 1 : 3;
    pkt["seq_number"] = seq_number;
    pkt["content_encripted"] = (destination_ip === server_ip_r1) ? content : data_crypto_1.Des.encrypt(content, _secret);
    pkt["timestamp_sent"] = Date.now();
    pkt["high_security"] = high_security;
    return pkt;
};
var test = function (packet_limit) {
    if (lock1 && lock2) {
        console.log("ok sending");
        var counter_1 = 0;
        var interval_1 = setInterval(function () {
            console.log(counter_1);
            var high_security = (getRandomInt(3) === 0) ? true : false;
            var destination = (high_security) ? { ip: server_ip_r2, client: client_r2 } : { ip: server_ip_r1, client: client_r1 };
            var pkt = generate_pkt(counter_1, destination["ip"], high_security);
            destination["client"].publish(topic_name, Buffer.from(JSON.stringify(pkt)));
            counter_1++;
            if (counter_1 === packet_limit)
                clearInterval(interval_1);
        }, 100);
        Sleep.sleep(1);
        client_r1.publish(topic_name, "_END_OF_DIALOG_");
        client_r1.end();
        client_r2.end();
    }
    else {
        console.log("bad");
    }
};
var client_r1_connection_options = {
    port: server_port_r1,
    clientId: my_clientId
};
var client_r1 = mqttClient.connect("mqtt://" + server_ip_r1, client_r1_connection_options);
client_r1.on('connect', function () {
    client_r1.subscribe(topic_name, function (err) {
        if (!err) {
            lock1 = true;
            test(1000);
            console.log("client_r1 successfully subscribed");
        }
    });
});
client_r1.on('message', function (topic, message) {
    console.log(message.toString());
});
var client_r2_connection_options = {
    port: server_port_r2,
    clientId: my_clientId
};
var client_r2 = mqttClient.connect("mqtt://" + server_ip_r2, client_r2_connection_options);
client_r2.on('connect', function () {
    client_r1.subscribe(topic_name, function (err) {
        if (!err) {
            lock2 = true;
            test(1000);
            console.log("client_r2 successfully subscribed");
        }
    });
});
client_r2.on('message', function (topic, message) {
    console.log(message.toString());
});
//# sourceMappingURL=app.js.map