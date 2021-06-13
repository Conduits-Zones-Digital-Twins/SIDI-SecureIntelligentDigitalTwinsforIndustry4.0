import * as mqttClient from "mqtt";
import { Des } from "data-crypto";
import * as Sleep from "sleep";

const DOCKER : boolean = false;

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}


const my_ip = (DOCKER) ? "10.0.0.11" : "192.168.1.111";
const server_ip_r1 : string = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
const server_ip_r2 : string = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
const server_port_r1 : number = 1883;
const server_port_r2 : number = 1883;
const my_clientId : string = `sender_${my_ip}`;
const _secret : string = "depl0yit";
const topic_name : string = "smart_routing_01";

let lock1 : boolean = false;
let lock2 : boolean = false;

const generate_pkt = (seq_number : number, destination_ip : string, high_security: boolean) => {
    const content = Math.random().toString(36).substring(2);
    const pkt : object = {};
    pkt["destination"] = destination_ip;
    pkt["n_forwards"] = (destination_ip === server_ip_r1) ? 1 : 3; //can be handles by traversing nodes
    pkt["seq_number"] = seq_number;
    pkt["content_encripted"] =  (destination_ip === server_ip_r1) ? content : Des.encrypt(content, _secret);
    // pkt["timestamp_sent"] = Number(process.hrtime.bigint());
    pkt["timestamp_sent"] = Date.now();
    pkt["high_security"] = high_security;
    return pkt;
}

const test = (packet_limit) => {

    if (lock1 && lock2){
      console.log("ok sending")
      // for (var i = 0; i < packet_limit; i++){
      //   console.log(i)
      //   const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
      //   const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2} : {ip: server_ip_r1, client: client_r1}; 
      //   const pkt = generate_pkt(i, destination["ip"], high_security);
      //   destination["client"].publish(topic_name, Buffer.from(JSON.stringify(pkt)));
      //   Sleep.usleep(1000 * 100); //microseconds = 10e-3 milliseconds
      //   // Sleep.msleep(10); 
      // }
      let counter = 0;
      const interval = setInterval(()=>{
        console.log(counter)
        const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
        const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2} : {ip: server_ip_r1, client: client_r1}; 
        const pkt = generate_pkt(counter, destination["ip"], high_security);
        destination["client"].publish(topic_name, Buffer.from(JSON.stringify(pkt)));
        counter++;
        if (counter === packet_limit) clearInterval(interval);
      },100);

      // sendPackets();
      Sleep.sleep(1);
      client_r1.publish(topic_name, "_END_OF_DIALOG_")
      client_r1.end();
      client_r2.end();
    }else{
      console.log("bad")
    }
}

const client_r1_connection_options = {
    port: server_port_r1,
    clientId: my_clientId
};
const client_r1 = mqttClient.connect(`mqtt://${server_ip_r1}`,client_r1_connection_options);

client_r1.on('connect', function () {
    client_r1.subscribe(topic_name, function (err) {
    if (!err) {
      lock1 = true;
      test(1000)
      console.log("client_r1 successfully subscribed");
    }
  })
});
  
client_r1.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
//   client.end()
});

const client_r2_connection_options = {
    port: server_port_r2,
    clientId: my_clientId
};
const client_r2 = mqttClient.connect(`mqtt://${server_ip_r2}`,client_r2_connection_options);

client_r2.on('connect', function () {
    client_r1.subscribe(topic_name, function (err) {
    if (!err) {
      lock2 = true;
      test(1000)
      console.log("client_r2 successfully subscribed");
    }
  })
});
  
client_r2.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
//   client.end()
});


// Sleep.usleep(1000);
// test(300);