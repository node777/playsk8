const router = require('express').Router();
const ethers=require("ethers");
const crypto = require("crypto");
var admin = require('firebase-admin')


var serviceAccount = require("../secrets/playsk8-firebase-adminsdk-hrlbt-4cf4095fb0.json");

const firebaseConfig = {
  apiKey: "AIzaSyDX0PrbtBoeOj6XMP_BlqeJ9EMptX7XQTQ",
  authDomain: "playsk8.firebaseapp.com",
  databaseURL: "https://playsk8-default-rtdb.firebaseio.com",
  projectId: "playsk8",
  storageBucket: "playsk8.appspot.com",
  messagingSenderId: "1033335410277",
  appId: "1:1033335410277:web:955fd507c941e5a7c1c08c",
  credential: admin.credential.cert(serviceAccount)
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);

let db= admin.database();

let assets=require("../sk8ers.json")

// router.post('/:asset', async(req, res)=>{
//   let body=req.body;
//   console.log(body)
//   let seed= await crypto.randomInt(0,100);
//   let odds=75;
//   res.send(seed<odds)
// });

async function executeTrick(){
  
}

router.post('/check', async(req, res)=>{
  let body=JSON.parse(req.body);
  console.log(body)
   db.ref(`addresses/${body.from}/games/${body.to}/`).once('value', (snapshot) => {
    
    if (snapshot.exists()) {
      let data= snapshot.val();
      console.log(data);
      res.send(data)
    } else {
      console.log("No data available");
      res.send("No data available");
    }
  });
    
});


router.post('/info', async(req, res)=>{
  db.ref(`games/${req.body.from}/`).once('value', (snapshot) => {
   
   if (snapshot.exists()) {
     let data= snapshot.val();
     console.log(data);
     res.send(data)
   } else {
     console.log("No data available");
     res.send("No data available")
   }
 });
   
});

router.post('/trick', async(req, res)=>{


  let body=JSON.parse(req.body);
  let sender=ethers.utils.verifyMessage(JSON.stringify(body.game), body.sig).toLowerCase()
  console.log(sender)

  console.log(body)
  
  //ref game
  let gameRef=db.ref(`games/${body.game.key}/`);
   gameRef.once('value', async(snapshot) => {
    
    if (snapshot.exists()) {
      let data= snapshot.val();
      console.log(data);
      if(data["turn"]==0 && data["challenger"]==sender){
        gameRef.child("p1_lastTrick").set(body.game.trick)
        gameRef.child("turn").set(1)
        res.send("Trick Executed")

      }else if(data["turn"]==1 && data["rival"]==sender){
        
        //gen seed
        let seed= await crypto.randomInt(0,100);
        let chance=(assets[body.game["sk8r"]].tricks[body.game.trick])||1

        gameRef.child("p2_lastTrick").set(body.game.trick)
        gameRef.child("turn").set(0)



        if(seed>chance){

          //check if p1 landed
          if(gameRef.child("p1_landed")==1){
            let p1_score=Number(gameRef.child("p1_score"))
            if(p1_score==2){
              gameRef.child("winner").set("p1")
            }
            gameRef.child("p1_score").set(p1_score++)
          }


          //record fail
          gameRef.child("p2_landed").set(0)
          res.send("Trick Failed")
        }else{

          
          //record land
          gameRef.child("p2_landed").set(0)
          res.send("Trick Landed")
        }


      }else{
        console.log(data["rival"],sender)
        res.send("Not Your Turn")

      }
    } else {
      console.log("No data available");
      res.send("No data available")
    }
  });
  //res.send({gj:1})
    
});



router.post('/create', async(req, res)=>{
  let body=JSON.parse(req.body);
  console.log(body)
  let challenge=body.challenge
  // {
  //   sender:"test"
  // }

  challenge.challenger=ethers.utils.verifyMessage(JSON.stringify(challenge), body.sig).toLowerCase()
  
  
  //set scores
  console.log(challenge,body.sig);
  challenge.p1_score=0
  challenge.p2_score=0
  challenge.p1_landed=0
  challenge.p2_landed=0
  challenge.turn=1
  challenge.rival=challenge.rival.toLowerCase();


  let k = await db.ref('games/').push().key;
  console.log(k)
  await db.ref(`games/${k}`).set(challenge);
  db.ref(`addresses/${challenge.challenger}/games/${challenge.rival}/${k}`).set(true);
  db.ref(`addresses/${challenge.rival}/games/${challenge.challenger}/${k}`).set(true);
    
  let seed= await crypto.randomInt(0,100);
  res.send({
    key:k,
    seed:seed
  })
});

  module.exports=router;