const dgram = require('dgram');
const client = dgram.createSocket('udp4');
// client.send(message, 0, message.length, 41234, 'localhost', (err) => {
//   client.close();
// });

const packet_limit = 50;
let counter = 0;
const interval = setInterval(()=>{
    console.log(counter)
    const message = Buffer.from('Some bytes'+counter);

    client.send(message, 0, message.length, 41234, '192.168.1.111', (err) => {
        // console.log(err)
        // client.close();
    });
    counter++;
    if (counter === packet_limit) clearInterval(interval);
},100);