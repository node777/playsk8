const crypto = require("crypto");
async function test(){
for(i=0;i<100;i++){
    let seed= await crypto.randomInt(0,100);
    console.log(seed);
}
}
test()