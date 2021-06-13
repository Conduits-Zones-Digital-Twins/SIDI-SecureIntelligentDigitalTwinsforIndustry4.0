import { Des, Aes, TripleDes, pinBlock, pinBlockFormat0 } from "data-crypto";

import * as aes256 from "aes256";

// console.log(hash_md5)

var text = "Text may be any length you wish, no padding is required.";


const t1 = Date.now();
const encrypted = TripleDes.encrypt(text, "Secret Passphrase");
const t2 = Date.now();

const decrypted = TripleDes.decrypt(encrypted, "Secret Passphrase");
const t3 = Date.now();

// -----------------------------


const encrypted1 = Des.encrypt(text, "Secret Passphrase");
const t4 = Date.now();

const decrypted1 = Des.decrypt(encrypted, "Secret Passphrase");
const t5 = Date.now();

// -----------------------------


var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const t6 = Date.now();

// Convert text to bytes
var textBytes = Buffer.from(text, "ascii");
// The counter is optional, and if omitted will begin at 1
var aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);



// To print or store the binary data, you may convert it to hex
encryptedBytes = Buffer.from(encryptedBytes);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

const t7 = Date.now();


// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
aesCtr = new Aes.ModeOfOperation.ctr(key, new Aes.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = Buffer.from(decryptedBytes);
console.log(decryptedText.toString("ascii"))

const t8 = Date.now();


// -----------------------------

var key1 = 'my passphrase';
var buffer = Buffer.from(text);

const t9 = Date.now();

var encryptedPlainText1 = aes256.encrypt(key1, text);

const t10 = Date.now();

var decryptedPlainText = aes256.decrypt(key1, encryptedPlainText1);
// plaintext === decryptedPlainText

const t11 = Date.now();


var encryptedBuffer1 = aes256.encrypt(key1, buffer);

const t12 = Date.now();


var decryptedBuffer = aes256.decrypt(key1, encryptedBuffer1);

const t13 = Date.now();

console.log("TripleDes");
console.log(t2 - t1);
console.log(t3 - t2);
console.log("Des");
console.log(t4 - t3);
console.log(t5 - t4);
console.log("aes");
console.log(t7 - t6);
console.log(t8 - t7);
console.log("aes256 string");
console.log(t10 - t9);
console.log(t11 - t10);
console.log("aes256 buffer");
console.log(t12 - t11);
console.log(t13 - t12);

console.log("------------print env var---------------");
console.log((process.env?.STATIC_IP) ? process.env.STATIC_IP : false);

