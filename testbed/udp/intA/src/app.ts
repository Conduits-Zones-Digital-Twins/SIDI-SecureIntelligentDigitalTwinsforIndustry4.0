// author: Matteo Mendula
// date: April 2021
// ref here: https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10
// performance: https://stackoverflow.com/questions/1235958/ipc-performance-named-pipe-vs-socket

import * as dgram from 'dgram';

import { TripleDes } from "data-crypto";

const DOCKER : boolean = false;

const my_ip : string = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
const server_ip_r1 : string = (DOCKER) ? "10.0.0.13" : "192.168.1.113";
const my_port : number = 41234;
const server_port_r1 : number = 41234;
const _secret : string = "depl0yit";

const client_r1 = dgram.createSocket('udp4');

const server = dgram.createSocket('udp4');

// ----------------------------
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (pkt, rinfo) => {
  // console.log(`server got: ${counter_pkt} from ${rinfo.address}:${rinfo.port}`);
  console.log("--------------------------------------------------")
  // console.log("received", packet)
  // console.log("received payload", packet.payload.toString())

  const pkt_as_string : string = pkt.toString();
  const packet_parsed : object = JSON.parse(pkt_as_string);
  packet_parsed["content_encripted"] =  TripleDes.encrypt(packet_parsed["content_encripted"], _secret);
  const pkt_as_string_to_send = JSON.stringify(packet_parsed);

  client_r1.send(pkt_as_string_to_send, 0, pkt_as_string_to_send.length, server_port_r1, server_ip_r1, (err) => {
    // console.log(err)
    // client.close();
  });
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(my_port);
