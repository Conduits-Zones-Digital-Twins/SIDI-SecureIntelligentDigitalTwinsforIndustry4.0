
import * as Net from "net";
import { Des } from "data-crypto";
import * as Sleep from "sleep";

const DOCKER : boolean = false;

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const server_ip_r1 : string = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
const server_ip_r2 : string = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
const server_port_r1 : number = 8225;
const server_port_r2 : number = 8225;
const _secret : string = "depl0yit";

const generate_pkt = (seq_number : number, destination_ip : string, high_security: boolean) => {
    const content = Math.random().toString(36).substring(2);
    const pkt : object = {};
    pkt["destination"] = destination_ip;
    pkt["n_forwards"] = (destination_ip === server_ip_r1) ? 1 : 3; //can be handles by traversing nodes
    pkt["seq_number"] = seq_number;
    pkt["content_encripted"] =  (destination_ip === server_ip_r1) ? content : Des.encrypt(content, _secret);
    pkt["timestamp_sent"] = Number(process.hrtime.bigint());
    pkt["high_security"] = high_security;
    return pkt;
}

const test = (packet_limit) => {
    let counter : number = 0;

    const sendPackets = async () => {
        const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
        const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2} : {ip: server_ip_r1, client: client_r1}; 
        const pkt = generate_pkt(counter, destination["ip"], high_security);
        destination["client"].write(JSON.stringify(pkt));
        Sleep.usleep(1000); //microseconds = 10e-3 milliseconds
        counter++;
        (counter <= packet_limit) && sendPackets();
    }

    for (var i = 0; i < packet_limit; i++){
        const high_security : boolean = (getRandomInt(3) === 0) ? true : false; //0,1,2
        const destination : object = (high_security) ? {ip: server_ip_r2, client: client_r2} : {ip: server_ip_r1, client: client_r1}; 
        const pkt = generate_pkt(counter, destination["ip"], high_security);
        destination["client"].write(JSON.stringify(pkt)+"_EOP_");
        Sleep.usleep(1000); //microseconds = 10e-3 milliseconds
    }

    // sendPackets();
    Sleep.usleep(1000);
    client_r1.write("_EOS_");
    client_r1.end();
    client_r2.end();
}

const client_r1 = Net.createConnection({ port: server_port_r1, host: server_ip_r1 }, () => {
    // 'connect' listener.
    console.log('connected to server ['+server_ip_r1+']!');
});
client_r1.setEncoding('utf8');
client_r1.on('error', (err) => {
    // Handle errors here.
    throw err;
});

client_r1.on('data', (data) => {
    console.log(data.toString());
    // client.end();
});

client_r1.on('end', () => {
    console.log('client_r1 disconnected from server');
});


const client_r2 = Net.createConnection({ port: server_port_r2, host: server_ip_r2 }, () => {
    // 'connect' listener.
    console.log('connected to server ['+server_ip_r2+']!');
});
client_r2.setEncoding('utf8');
client_r2.on('error', (err) => {
    // Handle errors here.
    throw err;
});

client_r2.on('data', (data) => {
    console.log(data.toString());
    // client.end();
});

client_r2.on('end', () => {
    console.log('client_r1 disconnected from server');
});

test(300);