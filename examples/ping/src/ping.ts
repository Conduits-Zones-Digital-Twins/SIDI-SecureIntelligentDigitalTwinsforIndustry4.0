import * as ping from "ping";

// var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
// hosts.forEach(function(host){
//     ping.sys.probe(host, function(isAlive){
//         var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
//         console.log(msg);
//     });
// });

if (process.env?.RECEIVER_IP){
    const host = process.env.RECEIVER_IP;
    ping.sys.probe(process.env.RECEIVER_IP, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
}else{
    console.log("No process.env?.RECEIVER_IP");
}