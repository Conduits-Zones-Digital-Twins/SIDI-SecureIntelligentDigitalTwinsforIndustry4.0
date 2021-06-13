// author: Matteo Mendula
// date: April 2021
// ref here: https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10
// performance: https://stackoverflow.com/questions/1235958/ipc-performance-named-pipe-vs-socket

import * as dgram from 'dgram';
import { Des, TripleDes } from "data-crypto";
import * as fs from "fs";

const DOCKER : boolean = false;

const my_ip : string = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
const my_port : number = 41234;
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
  fs.appendFileSync(file_name, `index,seq_number,content_encripted,high_security,n_forwards,destination,timestamp_sent,timestamp_received,current_pkt_frequency,latency,l_1,l_2`);

  for (var i in received_pkts_buffer){
    const row = received_pkts_buffer[i];
    const latency = Number(row["timestamp_received"]) - Number(row["timestamp_sent"])
    // console.log(row);
    const l_1 = (row["high_security"]) ? "" : latency;
    const l_2 = (!row["high_security"]) ? "" : latency;
    fs.appendFile(file_name, 
      `\n${i},${row["seq_number"]},${row["content_encripted"]},${row["high_security"]},${row["n_forwards"]},${row["destination"]},${row["timestamp_sent"]},${row["timestamp_received"]},${row["current_pkt_frequency"]},${latency},${l_1},${l_2}`
      , function (err) {
        if (err) throw err;
        console.log(`row${i} ok`);
    });
  }
}

const server = dgram.createSocket('udp4');

let counter_pkt = 0;

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

    if (pkt_as_string === "_END_OF_DIALOG_"){
      console.log("received payload end of dialog mex: ", pkt_as_string)
      server.close();
      createReport();
    }else{
      let packet_parsed : any = false;
      counter_pkt++;
      try {
        packet_parsed = JSON.parse(pkt_as_string);
      } catch (error) {}
      if (packet_parsed){
        console.log("received ", counter_pkt)
        // packet_parsed["timestamp_received"] = Number(process.hrtime.bigint());
        packet_parsed["timestamp_received"] = Date.now();
        received_pkts_buffer.push(packet_parsed);
      }
    }
    console.log("done pkt");
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(my_port);