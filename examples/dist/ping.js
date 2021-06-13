"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var ping = require("ping");
if ((_a = process.env) === null || _a === void 0 ? void 0 : _a.RECEIVER_IP) {
    var host_1 = process.env.RECEIVER_IP;
    ping.sys.probe(process.env.RECEIVER_IP, function (isAlive) {
        var msg = isAlive ? 'host ' + host_1 + ' is alive' : 'host ' + host_1 + ' is dead';
        console.log(msg);
    });
}
//# sourceMappingURL=ping.js.map