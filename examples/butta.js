const sleep = require('sleep');
let average = 0;

const limit = 100;
let n = 0;
const my_sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const test = async () => {
    // const now = Date.now();
    const now = process.hrtime.bigint();
    await my_sleep(1 / 1000000);
    const now1 = process.hrtime.bigint();
    console.log(now1 - now)
    n++;
    // (n < limit) && test();
}

const test1 = async () => {
    // const now = Date.now();
    const now = process.hrtime.bigint();
    sleep.usleep(500);
    const now1 = process.hrtime.bigint();
    console.log(now1 - now)
    average += Number(now1 - now)
    n++;
    (n < limit) && test1();
}

// test()
test1()
console.log(average/limit)