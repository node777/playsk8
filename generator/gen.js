const crypto = require("crypto");
const fs=require("fs")

//sk8ers=require("./sk8ers.json");

let attributes={
    gender:{
        Male:{
            odds:28
        },
        Female:{
            odds:15
        },
        Skeleton:{
            odds:57
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
    genderIdentiry:{
        binary:{
            odds:97
        },
        "Non-binary":{
            odds:3
        }
    },
    hat:{
        "No cap":{
            odds:38
        },
        "Baseball Cap":{
            odds:16
        },
        "Beanie":{
            odds:14
        },
        "Sombrero":{
            odds:12
        },
        "Pilot Helmet w/ goggles":{
            odds:7
        },
        "Mental Health Hat":{
            odds:5
        },
        "Cowboy Hat":{
            odds:4
        },
        "Tassle Hat":{
            odds:3
        },
        "Police Cap":{
            odds:1
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
            odds:25
        },
        "White T Shirt":{
            odds:19
        },
        "Dark Green Tank Top":{
            odds:16
        },
        "Grey Tank Top w/ Hot Topic Logo":{
            odds:13
        },
        "Black T w/ White Skull":{
            odds:10
        },
        "Black T w/ PLAYSK8 Heart":{
            odds:9
        },
        "Black Hoodie w/ Gold Bitcoin Logo":{
            odds:5
        },
        "No Shirt w/ Tattoo":{
            odds:3
        },
        "Cop":{
            odds:1
        }
    },
    pants:{
        "Black Pants":{
            odds:25
        },
        "Black Shorts":{
            odds:13
        },
        "Jean Shorts":{
            odds:9
        },
        "Khaki Pants":{
            odds:18
        },
        "Maroon Pants":{
            odds:5
        },
        "Cargo Shorts":{
            odds:7
        },
        "Ripped Blue Jeans":{
            odds:20
        },
        "Cop Pants":{
            odds:3
        }
    },
    shoes:{
        "Black":{
            odds:30
        },
        "White":{
            odds:20
        },
        "Checkered Vans":{
            odds:18
        },
        "Classic Vans":{
            odds:11
        },
        "Black/White Converse":{
            odds:15
        },
        "Boots":{
            odds:1
        },
        "Red":{
            odds:5
        }
    },
    skateboard:{
        "Derivative 1":{
            odds:0
        },
        "Derivative 2":{
            odds:0
        },
        "Mutant Apes":{
            odds:20
        },
        "Cool Cat":{
            odds:15
        },
        "CrypoToadz":{
            odds:12
        },
        "Punk":{
            odds:10
        },
        "Ethereum Logo":{
            odds:5
        },
        "PlaySK8 Logo":{
            odds:35
        },
        "Bitcoin Logo":{
            odds:3
        }
    },
    background:{
        
        "No Background":{
            odds:0
        },
        "Venice Beach":{
            odds:25
        },
        "Grafitti Pits":{
            odds:20
        },
        "LA Courthouse":{
            odds:17
        },
        "Hollywood High":{
            odds:15
        },
        "Shepard Fairey":{
            odds:0
        },
        "CBS Crew":{
            odds:10
        },
        "SABER AWR Crew":{
            odds:13
        },
        "Mr Brainwash":{
            odds:0
        }
    },
    accessories:{
        "None":{
            odds:28
        },
        "Black Jansport Backpack":{
            odds:20
        },
        "Cast On Broken Arm":{
            odds:17
        },
        "Spray Can":{
            odds:14
        },
        "Guitar Strapped to Back":{
            odds:10
        },
        "Skull Bandana":{
            odds:3
        },
        "Silver Medal":{
            odds:5
        },
        "Gold Medal":{
            odds:3
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
let skeles=0

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
        character.hair="Pink Mohawk"
        // delete character.genderIdentiry
        //
    }else if(character.gender=="Female"){
        character.beard="None"
        if(character.shirt=="No Shirt w/ Tattoo"){
            character.shirt="Black T Shirt"
        }
    }
    // if(character.hair=="Pink Mohawk"){
    //     character.hat="No cap"
    // }
    if(character.hair=="Pink Mohawk"&&character.hat!="No cap"){
        character.hair="Bleach Buzz"
    }
    if(character.hair=="Wild Hair Red"||character.hair=="Wild Hair Black"){
        character.hat="No cap"
    }

    //check dupes
    if(charList.includes(JSON.stringify(character))){
        //console.log("found collision", charList);

        return await generateCharacter()
    }else{
        //check stips


        charList.push(JSON.stringify(character))
        if(character.gender=="Skeleton"){
            skeles++
            console.log(skeles)

            if(skeles==666){
                attributes.gender.Skeleton.odds=0
                attributes.gender.Male.odds=60
                attributes.gender.Female.odds=40

            }
        }
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

        if(characters[s].gender=="Female"&&characters[s].shirt=="No Shirt w/ Tattoo"){
                characters[s].shirt="Black T Shirt"
            
        }
    }
    finalize();
}

async function finalize(){
    
    shuffle()
    //fs.writeFileSync("./sk8ers.json", JSON.stringify(characters))
}

async function shuffle(){
    let unusedPositions=Array.from(Array(10000).keys())
    unusedPositions[0]=10000
    //console.log(unusedPositions)
    let newList={}
    for(sk8er in characters){
        let r = unusedPositions.length-1?crypto.randomInt(0,unusedPositions.length-1):0
        let pos=unusedPositions.splice(r, 1)

        newList[sk8er]=characters[pos];
        //unusedPositions.splice(r,1);

    }
    //console.log(unusedPositions)
    fs.writeFileSync("./sk8ers.json", JSON.stringify(newList))

}

generateSk8ers();