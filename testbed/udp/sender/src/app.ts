import * as dgram from 'dgram';
import { Des } from "data-crypto";
import * as Sleep from "sleep";

const DOCKER : boolean = false;

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const parsePktPerSecondsToWaitingTime_millis = (packets_per_seconds) => {
  return Math.ceil(1000 / packets_per_seconds);
}


const my_ip = (DOCKER) ? "10.0.0.11" : "192.168.1.111";
const server_ip_r1 : string = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
const server_ip_r2 : string = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
const server_port_r1 : number = 41234;
const server_port_r2 : number = 41234;
const _secret : string = "depl0yit";

const generate_pkt = (seq_number : number, destination_ip : string, high_security: boolean, current_pkt_frequency : number) => {
    const content = Math.random().toString(36).substring(2);
    const pkt : object = {};
    pkt["destination"] = destination_ip;
    pkt["n_forwards"] = (destination_ip === server_ip_r1) ? 1 : 3; //can be handles by traversing nodes
    pkt["seq_number"] = seq_number;
    pkt["content_encripted"] =  (destination_ip === server_ip_r1) ? content : Des.encrypt(content, _secret);
    // pkt["timestamp_sent"] = Number(process.hrtime.bigint());
    pkt["timestamp_sent"] = Date.now();
    pkt["high_security"] = high_security;
    pkt["current_pkt_frequency"] = current_pkt_frequency;
    return pkt;
}

const test = (packet_limit) => {

  console.log("ok sending");
  // for (var i = 0; i < packet_limit; i++){
  //   console.log(i)
  //   const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
  //   const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2, port: server_port_r2} : {ip: server_ip_r1, client: client_r1, port: server_port_r1}; 
  //   const pkt = generate_pkt(i, destination["ip"], high_security);
  //   const pkt_as_string = JSON.stringify(pkt);
  //   destination["client"].send(Buffer.from(pkt_as_string), 0, pkt_as_string.length, destination["port"], destination["ip"], (err) => {
  //     // console.log(err)
  //     // client.close();
  //   });
  //   Sleep.usleep(1000 * 100); //microseconds = 10e-3 milliseconds
  //   // Sleep.msleep(10); 
  // }

  // Sleep.sleep(1);
  // client_r1.send(Buffer.from("_END_OF_DIALOG_"), 0, "_END_OF_DIALOG_".length, server_port_r1, server_ip_r1, (err) => {
  //   // console.log(err)
  //   // client.close();
  // });
  // client_r1.close()
  // client_r2.close()


  let counter = 0;

  const first_send_pkts = Math.ceil(packet_limit / 3);
  const second_send_pkts = Math.ceil(packet_limit / 3 * 2);
  const third_send_pkts = packet_limit;

  const first_send_time_pkt_per_sec = 100;
  const second_send_time_pkt_per_sec = 450;
  const third_send_time_pkt_per_sec = 1000;

  let current_pkt_frequency = first_send_time_pkt_per_sec;

  const sendPacktsFunction = ()=> {
    console.log(counter)
    const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
    const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2, port: server_port_r2} : {ip: server_ip_r1, client: client_r1, port: server_port_r1}; 
    const pkt = generate_pkt(counter, destination["ip"], high_security, current_pkt_frequency);
    const pkt_as_string = JSON.stringify(pkt);
    destination["client"].send(Buffer.from(pkt_as_string), 0, pkt_as_string.length, destination["port"], destination["ip"], (err) => {
      // console.log(err)
      // client.close();
    });
    counter++;

    if (counter < first_send_pkts) {
      current_pkt_frequency = first_send_time_pkt_per_sec
      setTimeout(sendPacktsFunction, parsePktPerSecondsToWaitingTime_millis(current_pkt_frequency)); 
    }else if (counter < second_send_pkts){
      current_pkt_frequency = second_send_time_pkt_per_sec
      setTimeout(sendPacktsFunction, parsePktPerSecondsToWaitingTime_millis(current_pkt_frequency));
    }else if (counter < third_send_pkts) {
      current_pkt_frequency = third_send_time_pkt_per_sec
      setTimeout(sendPacktsFunction, parsePktPerSecondsToWaitingTime_millis(current_pkt_frequency));
    }else setTimeout(()=>{
      console.log("sending _END_OF_DIALOG_")
      // Sleep.sleep(1);
      client_r1.send(Buffer.from("_END_OF_DIALOG_"), 0, "_END_OF_DIALOG_".length, server_port_r1, server_ip_r1, (err) => {
        // console.log(err)
        // client.close();
      });
      // Sleep.sleep(1);
      setTimeout(()=>{
        client_r1.close()
        client_r2.close()
      }, 2000);
    }, 2000);
  }
  

  setTimeout(sendPacktsFunction, parsePktPerSecondsToWaitingTime_millis(first_send_time_pkt_per_sec));

  // const interval_1 = setInterval(()=>{
  //   console.log(counter)
  //   const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
  //   const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2, port: server_port_r2} : {ip: server_ip_r1, client: client_r1, port: server_port_r1}; 
  //   const pkt = generate_pkt(counter, destination["ip"], high_security);
  //   const pkt_as_string = JSON.stringify(pkt);
  //   destination["client"].send(Buffer.from(pkt_as_string), 0, pkt_as_string.length, destination["port"], destination["ip"], (err) => {
  //     // console.log(err)
  //     // client.close();
  //   });
  //   counter++;
  //   if (counter === first_send){
  //     clearInterval(interval_1);
  //   } 
  // },100);

}

const client_r1 = dgram.createSocket('udp4');
const client_r2 = dgram.createSocket('udp4');


test(10000);
