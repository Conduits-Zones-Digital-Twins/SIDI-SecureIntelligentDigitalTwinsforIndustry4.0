
const Net = require("net");

const client = Net.createConnection({ port: 8124 }, (socket) => {
    // 'connect' listener.
    console.log('connected to server!');
    client.setNoDelay(true);
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


// client.once('connect', function listener() {
//     //socket.on
//         console.log('connect');
//         client.setNoDelay(true);
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//         client.write('how about making the message verylonggggggggggggggggggggggggghow about making the message verylonggggggggggggggggggggggggg');
//     });

let c = 0 
for (var i = 0; i < 10; i++){
    setTimeout(()=>{
        client.write("hello"+c);
        c++
    }, 1000)
}

// let x = 0;
// setInterval(()=>{
//     client.write('CLIENT: TCP packet '+ x +' from client!\r\n');
//     x++
// }, 1000);

// setTimeout(function(){
//     client.end('Bye bye server');
//   },5000);