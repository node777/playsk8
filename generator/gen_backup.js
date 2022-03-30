const crypto = require("crypto");
const fs=require("fs")

let sk8ers=require("./sk8ers.json");

let attributes={
    gender:{
        Male:{
            odds:58
        },
        Female:{
            odds:30
        },
        "Non-binary":{
            odds:7
        },
        Skeleton:{
            odds:5
        }
    },
    skin:{
        White:{
            odds:33
        },
        Tan:{
            odds:34
        },
        Black:{
            odds:33
        },
        Bone:{
            odds:0
        }
    },
    hat:{
        "No cap":{
            odds:60
        },
        "Backwards Baseball Cap":{
            odds:8
        },
        "Baseball Cap":{
            odds:7
        },
        "Beanie":{
            odds:6
        },
        "Pilot Helmet w/ goggles":{
            odds:6
        },
        "Sombrero":{
            odds:4
        },
        "Tassle Hat":{
            odds:3
        },
        "Police Cap":{
            odds:1
        },
        "Mental Health Hat":{
            odds:5
        }
        
    },
    mouth:{
        
        "Normal":{
            odds:83
        },
        "Lit Joint w/ Smoke Rising from Ember":{
            odds:17
        }
    },
    beard:{
        
        "None":{
            odds:83
        },
        "Brown Beard":{
            odds:17
        }
    },
    eyes:{
        
        "Normal":{
            odds:58
        },
        "Black Sun Glasses":{
            odds:10
        },
        "Hear shapped glasses":{
            odds:10
        },
        "3D Glasses w/ One Blue Lens & One Red Lens":{
            odds:7
        },
        "Snowboard Goggles w/ Orange Lenses":{
            odds:7
        },
        "Visor Glasses":{
            odds:5
        },
        "Bitcoin Laser Eyes":{
            odds:3
        }
    },
    lip:{
        "Normal":{
            odds:95
        },
        "Lip Piercing":{
            odds:5
        }
    },
    nose:{
        "Normal":{
            odds:95
        },
        "Nose Piercing":{
            odds:5
        }
    },
    shirt:{
        "Black T Shirt":{
            odds:24
        },
        "White T Shirt":{
            odds:17
        },
        "Dark Green Tank Top":{
            odds:17
        },
        "Grey Tank Top w/ Hot Topic Logo":{
            odds:10
        },
        "Black T w/ White Skull":{
            odds:10
        },
        "Black T w/ PLAYSK8 Heart":{
            odds:7
        },
        "Black Hoodie w/ Gold Bitcoin Logo":{
            odds:7
        },
        "No Shirt w/ Tattoo":{
            odds:5
        },
        "Cop":{
            odds:3
        }
    },
    pants:{
        "Black Pants":{
            odds:24
        },
        "Black Shorts":{
            odds:17
        },
        "Jean Shorts":{
            odds:17
        },
        "Khaki Pants":{
            odds:14
        },
        "Maroon Pants":{
            odds:14
        },
        "Cargo Shorts":{
            odds:7
        },
        "Ripped Blue Jeans":{
            odds:7
        }
    },
    shoes:{
        "Black":{
            odds:24
        },
        "White":{
            odds:17
        },
        "Red":{
            odds:17
        },
        "Checkered Vans":{
            odds:14
        },
        "Classic Vans":{
            odds:14
        },
        "Black/White Converse":{
            odds:7
        },
        "Boots":{
            odds:7
        },
    },
    skateboard:{
        "Derivative 1":{
            odds:24
        },
        "Derivative 2":{
            odds:17
        },
        "Derivative 3":{
            odds:17
        },
        "Derivative 4":{
            odds:10
        },
        "Derivative 5":{
            odds:10
        },
        "Derivative 6":{
            odds:7
        },
        "Ethereum Logo":{
            odds:7
        },
        "PlaySK8 Logo":{
            odds:7
        },
        "Bitcoin Logo":{
            odds:1
        }
    },
    background:{
        
        "No Background":{
            odds:24
        },
        "Venice Beach":{
            odds:17
        },
        "Grafitti Pits":{
            odds:17
        },
        "LA Courthouse":{
            odds:10
        },
        "Hollywood High":{
            odds:10
        },
        "Shepard Fairey":{
            odds:7
        },
        "CBS Crew":{
            odds:3
        },
        "SABER AWR Crew":{
            odds:5
        },
        "Mr Brainwash":{
            odds:7
        }
    },
    accessories:{
        "None":{
            odds:70
        },
        "Black Jansport Backpack":{
            odds:7
        },
        "Guitar Strapped to Back":{
            odds:7
        },
        "Cast On Broken Arm":{
            odds:7
        },
        "Spray Can":{
            odds:5
        },
        "Skull Bandana":{
            odds:3
        },
        "Gold Medal":{
            odds:1
        }
    }
}
let altAttributes={
    hair:{
        "Short Hair Black":{
            odds:24
        },
        "Short Hair Silver":{
            odds:3
        },
        "Short Hair Blonde":{
            odds:15
        },
        "Short Hair Brown":{
            odds:15
        },
        "Long Hair Blonde":{
            odds:9
        },
        "Long Hair Black":{
            odds:8
        },
        "Long Hair Brown":{
            odds:10
        },
        "Wild Hair Black":{
            odds:8
        },
        "Wild Hair Red":{
            odds:5
        },
        "Bleach Buzz":{
            odds:2
        },
        "Pink Mohawk":{
            odds:1
        }
    },
    femaleHair:{
        "Short Hair Black":{
            odds:8
        },
        "Short Hair Silver":{
            odds:3
        },
        "Short Hair Blonde":{
            odds:5
        },
        "Short Hair Brown":{
            odds:5
        },
        "Long Hair Blonde":{
            odds:24
        },
        "Long Hair Black":{
            odds:20
        },
        "Long Hair Brown":{
            odds:20
        },
        "Wild Hair Black":{
            odds:8
        },
        "Wild Hair Red":{
            odds:5
        },
        "Bleach Buzz":{
            odds:1
        },
        "Pink Mohawk":{
            odds:1
        }
    }
}
let characters={}
let charList=[]
let counter=1;
let genTotal=10000;

async function generate(attribute){
    let luckCounter=0;
    let seed= await crypto.randomInt(0,100);
    for(a in attributes[attribute]){

        luckCounter+=attributes[attribute][a].odds
        if(seed<luckCounter){
            return a
        }
    }
}
async function generateCharacter(){
    let gender=await generate("gender")
    gender=="Female"?attributes.hair=altAttributes.femaleHair:attributes.hair=altAttributes.hair;

    let skin=await generate("skin")
    let hair=await generate("hair")
    let hat=await generate("hat")
    let mouth=await generate("mouth")
    let lip=await generate("lip")
    let eyes=await generate("eyes")
    let beard=await generate("beard")
    let nose=await generate("nose")
    
    let character= {
        gender: gender,
        skin:skin,
        hair:hair,
        hat:hat,
        mouth:mouth,
        beard:beard,
        lip:lip,
        eyes:eyes,
        nose:nose
    }
    
    //check special conditions
    if(character.gender=="Skeleton"){
        character.skin="Bone"
    }else if(character.gender=="Female"){
        character.beard="None"
    }
    if(character.hair=="Pink Mohawk"){
        character.hat="No cap"
    }

    //check dupes
    if(charList.includes(JSON.stringify(character))){
        console.log("found collision", character);

        return await generateCharacter()
    }else{
        //check stips


        charList.push(JSON.stringify(character))
        return character
    }
}
async function generateSk8ers(){
    for(counter; counter<=genTotal; counter++){

        let character=await generateCharacter()
        characters[counter]=character
    }
    addBodyTraits()
}
async function addBodyTraits(){
    for(s in characters){
        characters[s].shirt=await generate("shirt");
        characters[s].pants=await generate("pants");
        characters[s].shoes=await generate("shoes");
        characters[s].skateboard=await generate("skateboard");
        characters[s].accessories=await generate("accessories");
        characters[s].background=await generate("background");
    }
    finalize();
}

async function finalize(){
    
    fs.writeFileSync("./sk8ers.json", JSON.stringify(characters))
}

generateSk8ers();