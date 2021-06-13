var mqtt = require("mqtt");

var client = mqtt.connect("mqtt://localhost",
    {
        port: 1883,
        clientId:"mqttjs01"
    });

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      for (var i = 0; i < 10; i++){
        client.publish('presence', Buffer.from(JSON.stringify({a: 'Hello mqtt'+i})))
      }
    }
  })
})
  
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})