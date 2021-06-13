"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Net = require("net");
var data_crypto_1 = require("data-crypto");
var Sleep = require("sleep");
var DOCKER = false;
var getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};
var server_ip_r1 = (DOCKER) ? "10.0.0.14" : "192.168.1.114";
var server_ip_r2 = (DOCKER) ? "10.0.0.12" : "192.168.1.112";
var server_port_r1 = 8225;
var server_port_r2 = 8225;
var _secret = "depl0yit";
var generate_pkt = function (seq_number, destination_ip, high_security) {
    var content = Math.random().toString(36).substring(2);
    var pkt = {};
    pkt["destination"] = destination_ip;
    pkt["n_forwards"] = (destination_ip === server_ip_r1) ? 1 : 3;
    pkt["seq_number"] = seq_number;
    pkt["content_encripted"] = (destination_ip === server_ip_r1) ? content : data_crypto_1.Des.encrypt(content, _secret);
    pkt["timestamp_sent"] = Number(process.hrtime.bigint());
    pkt["high_security"] = high_security;
    return pkt;
};
var test = function (packet_limit) {
    var counter = 0;
    var sendPackets = function () { return __awaiter(void 0, void 0, void 0, function () {
        var high_security, destination, pkt;
        return __generator(this, function (_a) {
            high_security = (getRandomInt(3) === 0) ? true : false;
            destination = (high_security) ? { ip: server_ip_r2, client: client_r2 } : { ip: server_ip_r1, client: client_r1 };
            pkt = generate_pkt(counter, destination["ip"], high_security);
            destination["client"].write(JSON.stringify(pkt));
            Sleep.usleep(1000);
            counter++;
            (counter <= packet_limit) && sendPackets();
            return [2];
        });
    }); };
    for (var i = 0; i < packet_limit; i++) {
        var high_security = (getRandomInt(3) === 0) ? true : false;
        var destination = (high_security) ? { ip: server_ip_r2, client: client_r2 } : { ip: server_ip_r1, client: client_r1 };
        var pkt = generate_pkt(counter, destination["ip"], high_security);
        destination["client"].write(JSON.stringify(pkt) + "_EOP_");
        Sleep.usleep(1000);
    }
    Sleep.usleep(1000);
    client_r1.write("_EOS_");
    client_r1.end();
    client_r2.end();
};
var client_r1 = Net.createConnection({ port: server_port_r1, host: server_ip_r1 }, function () {
    console.log('connected to server [' + server_ip_r1 + ']!');
});
client_r1.setEncoding('utf8');
client_r1.on('error', function (err) {
    throw err;
});
client_r1.on('data', function (data) {
    console.log(data.toString());
});
client_r1.on('end', function () {
    console.log('client_r1 disconnected from server');
});
var client_r2 = Net.createConnection({ port: server_port_r2, host: server_ip_r2 }, function () {
    console.log('connected to server [' + server_ip_r2 + ']!');
});
client_r2.setEncoding('utf8');
client_r2.on('error', function (err) {
    throw err;
});
client_r2.on('data', function (data) {
    console.log(data.toString());
});
client_r2.on('end', function () {
    console.log('client_r1 disconnected from server');
});
test(300);
//# sourceMappingURL=app.js.map