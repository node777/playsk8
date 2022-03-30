const crypto = require("crypto");
const fs=require("fs")

let sk8ers=require("./sk8ers.json");

async function generate(){
    let luckCounter=0;
    let seed= await crypto.randomInt(0,100);
    for(a in tricks){

        luckCounter+=25
        if(seed<luckCounter){
            let t={... tricks}
            delete t[a];
            //console.log(t)
            return t
        }
    }
}

let tricks={
    "Ollie":{
        odds:79
    },
    "Pop Shuvit":{
        odds:75
    },
    "Kickflip":{
        odds:73
    },
    "Heelflip":{
        odds:71
    }
}
let newSk8ers={}
async function edit(){
    for(s in sk8ers){
        //let character=sk8ers[s]
        // if(sk8ers[s].gender=="Skeleton"){
        //     sk8ers[s].lip="Normal"
        //     if(sk8ers[s].shirt=="No Shirt w/ Tattoo"){
        //         sk8ers[s].shirt="Black T Shirt"
        //     }
        // }
        // sk8ers[s].tricks=await generate();
        
        newSk8ers[s]={
            name:`Sk8er ${s}`,
            attributes:[]
        }
        for(trait in sk8ers[s]){
            //console.log(sk8ers[s][trait])
            if(trait!="tricks"){
                newSk8ers[s].attributes.push({
                    "trait_type":trait,
                    "value":sk8ers[s][trait]
                })
            }else{
                newSk8ers[s][trait]=sk8ers[s][trait]
            }
        }

    }
    fs.writeFileSync("./sk8ersEdited.json", JSON.stringify(newSk8ers))
}
edit()