
import * as Net from "net";

const client = Net.createConnection({ port: 8124 }, () => {
    // 'connect' listener.
    console.log('connected to server!');
    client.write('CLIENT: TCP packet from client!\r\n');
});
client.setEncoding('utf8');
client.on('error', (err) => {
    // Handle errors here.
    throw err;
});

client.on('data', (data) => {
    console.log(data.toString());
    // client.end();
});

client.on('end', () => {
    console.log('disconnected from server');
});

// let x = 0;
// setInterval(()=>{
//     client.write('CLIENT: TCP packet '+ x +' from client!\r\n');
//     x++
// }, 1000);

// setTimeout(function(){
//     client.end('Bye bye server');
//   },5000);