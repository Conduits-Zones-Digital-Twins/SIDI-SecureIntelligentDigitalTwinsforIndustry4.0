// author: Matteo Mendula
// date: April 2021
// ref here: https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10
// performance: https://stackoverflow.com/questions/1235958/ipc-performance-named-pipe-vs-socket

import * as Net from "net";
import * as mqttConnection from "mqtt-connection";
import { Des, TripleDes } from "data-crypto";
import * as fs from "fs";

const DOCKER : boolean = false;

const my_ip : string = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
const my_port : number = 1883;
const _secret : string = "depl0yit";


const received_pkts_buffer : Array<object> = [];

const createReport = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  const hh = today.getHours();
  const min = today.getMinutes();
  const s = today.getSeconds();
  const file_name = `${hh}_${min}_${s}_${dd}_${mm}_${yyyy}.csv`;
  fs.appendFileSync(file_name, `seq_number,content_encripted,high_security,n_forwards,destination,timestamp_sent,timestamp_received,latency`);

  for (var i in received_pkts_buffer){
    const row = received_pkts_buffer[i];
    // console.log(row);

    const latency = Number(row["timestamp_received"]) - Number(row["timestamp_sent"])
    fs.appendFile(file_name, 
      `\n${row["seq_number"]},${row["content_encripted"]},${row["high_security"]},${row["n_forwards"]},${row["destination"]},${row["timestamp_sent"]},${row["timestamp_received"]},${latency}`
      , function (err) {
        if (err) throw err;
        console.log(`row${i} ok`);
    });
  }
}

const server = new Net.Server();

let counter_pkt = 0;
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
    // console.log("received", packet)
    // console.log("received payload", packet.payload.toString())

    const pkt_as_string : string = packet.payload.toString();

    // if (pkt_as_string === "_END_OF_DIALOG_"){
    if (counter_pkt >= 1000){
      console.log("received payload end of dialog mex: ", pkt_as_string)
      server.close();
      client.destroy();
      createReport();
    }else{
      let packet_parsed : any = false;
      counter_pkt++;
      try {
        packet_parsed = JSON.parse(pkt_as_string);
      } catch (error) {}
      if (packet_parsed){
        console.log("received payload", counter_pkt)
        // packet_parsed["timestamp_received"] = Number(process.hrtime.bigint());
        packet_parsed["timestamp_received"] = Date.now();
        received_pkts_buffer.push(packet_parsed);
      }
    }
    console.log("done pkt")
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

