// author: Matteo Mendula
// date: April 2021
// ref here: https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10
// performance: https://stackoverflow.com/questions/1235958/ipc-performance-named-pipe-vs-socket

import * as Net from "net";
import * as mqttClient from "mqtt";
import * as mqttConnection from "mqtt-connection";

import { TripleDes } from "data-crypto";

const DOCKER : boolean = false;

const my_ip : string = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
const server_ip_r1 : string = (DOCKER) ? "10.0.0.13" : "192.168.1.113";
const my_port : number = 1883;
const server_port_r1 : number = 1883;
const _secret : string = "depl0yit";

const my_clientId : string = `intA_${my_ip}`;
const topic_name : string = "smart_routing_01";


const client_r1_connection_options = {
  port: server_port_r1,
  clientId: my_clientId
};
const client_r1 = mqttClient.connect(`mqtt://${server_ip_r1}`,client_r1_connection_options);

client_r1.on('connect', function () {
  client_r1.subscribe(topic_name, function (err) {
  if (!err) {
    console.log("client_r1 successfully subscribed");
  }
})
});

client_r1.on('message', function (topic, message) {
// message is Buffer
console.log(message.toString())
//   client.end()
});

const server = Net.createServer();

server.on('connection', function (stream) {
  var client = mqttConnection(stream);

  // client connected
  client.on('connect', function (packet) {
    // acknowledge the connect packet
    client.connack({ returnCode: 0 });
  })

  // client published
  client.on('publish', function (packet) {
    // send a puback with messageId (for QoS > 0)
    // client.puback({ messageId: packet.messageId })
    console.log("--------------------------------------------------")
    console.log("received", packet)
    // console.log("received payload", packet.payload.toString())
    console.log("received payload", JSON.parse(packet.payload.toString()))

    const pkt_as_string : string = packet.payload.toString();
    const packet_parsed : object = JSON.parse(pkt_as_string);
    packet_parsed["content_encripted"] =  TripleDes.encrypt(packet_parsed["content_encripted"], _secret);
    client_r1.publish(topic_name, Buffer.from(JSON.stringify(packet_parsed)));   
    console.log("pkt done")
  })

  // client pinged
  client.on('pingreq', function () {
    // send a pingresp
    client.pingresp()
  });

  // client subscribed
  client.on('subscribe', function (packet) {
    // send a suback with messageId and granted QoS level
    client.suback({ granted: [packet.qos], messageId: packet.messageId })
  })

  // timeout idle streams after 5 minutes
  stream.setTimeout(1000 * 60 * 5)

  // connection error handling
  client.on('close', function () { client.destroy() })
  client.on('error', function () { client.destroy() })
  client.on('disconnect', function () { client.destroy() })

  // stream timeout
  stream.on('timeout', function () { client.destroy(); })
})

// listen on port 1883
server.listen(my_port, ()=>{console.log("listening")})
