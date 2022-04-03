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
  console.log(body)

  
  //ref game
  let gameRef=db.ref(`games/${body.game.key}/`);

  gameRef.once('value', async(snapshot) => {
    
    if (snapshot.exists()) {

      //get gamedata
      let data= snapshot.val();
      console.log(data);

      //if p1 turn
      if(data["turn"]==1 && data["p1"]==sender){

console.log(body.game["sk8r"], assets[2])
        //gen seed
        let seed= await crypto.randomInt(0,100);
        let chance=(assets[body.game["sk8r"]].tricks[body.game.trick])||1

        //set sk8r
        
        data["p1_sk8r"]!=body.game["sk8r"]?gameRef.child("p1_sk8r").set(body.game.sk8r):""

        if(data["p1_lastTrick"]==body.game.trick){
          res.send("Cannot play move again")
          return 1
        }

        gameRef.child("p1_lastTrick").set(body.game.trick)
        gameRef.child("turn").set(2)


        //if fail
        if(seed>chance){

          //record fail
          gameRef.child("p1_landed").set(0)

          //check if p2 played this trick last AND landed 
          if(data["p2_lastTrick"]==body.game.trick && data["p2_landed"]==1){
            //add 1 to p2 score
            let p1_score=Number(data["p2_score"])
            gameRef.child("p2_score").set(p1_score++)

            if(data["p2_score"]==2){
              gameRef.child("winner").set(2)
              res.send("Opponent won")
            }
            res.send("Point for opponent")
          }


          res.send("Trick Failed")
        }
        //if success
        else{

          
          //check if p2 played this trick AND p2 failed
          if(data["p2_lastTrick"]==body.game.trick && data["p2_landed"]==0){

            //set p1 lastTrick to none
            gameRef.child("p2_lastTrick").set(0)
          }
          //record land
          gameRef.child("p1_landed").set(1)
          res.send("Trick Landed")
        }



      }

      //if p2 turn
      else if(data["turn"]==2 && data["p2"]==sender){
        
        //gen seed
        let seed= await crypto.randomInt(0,100);
        let chance=(assets[body.game["sk8r"]].tricks[body.game.trick])||1

        //set p2 sk8r
        data["p2_sk8r"]!=body.game["sk8r"]?gameRef.child("p2_sk8r").set(body.game.sk8r):""

        if(data["p2_lastTrick"]==body.game.trick){
          res.send("Cannot play move again")
          return 1
        }

        gameRef.child("p2_lastTrick").set(body.game.trick)
        gameRef.child("turn").set(1)


        //if fail
        if(seed>chance){

          //record fail
          gameRef.child("p2_landed").set(0)

          //check if p1 played this trick last AND landed 
          if(data["p1_lastTrick"]==body.game.trick && data["p1_landed"]==1){
            //add 1 to p1 score
            let p1_score=Number(data["p1_score"])
            gameRef.child("p1_score").set(p1_score++)

            if(data["p1_score"]==2){
              gameRef.child("winner").set(1)
              res.send("Opponent won")
            }
            res.send("Point for opponent")
          }


          res.send("Trick Failed")
        }
        //if success
        else{

          
          //check if p1 played this trick AND p1 failed
          if(data["p1_lastTrick"]==body.game.trick && data["p1_landed"]==0){

            //set p1 lastTrick to none
            gameRef.child("p1_lastTrick").set(0)
          }
          //record land
          gameRef.child("p2_landed").set(1)
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
  
  //get challenge info
  let body=JSON.parse(req.body);
  let challenge={
    
  }

  //gen seed
  let seed= await crypto.randomInt(0,100);


  //get signer
  let signer=ethers.utils.verifyMessage(JSON.stringify(challenge), body.sig).toLowerCase()

  //if signer is rival
  if(signer==body.challenge.rival){
    res.send("Cannot challenge self")
  }
  if(seed>50){
    challenge.p1=signer
    challenge.p2=body.challenge.rival.toLowerCase();
    challenge.challenger=1
  }else{
    challenge.p1=body.challenge.rival.toLowerCase();
    challenge.p2=signer
    challenge.challenger=2
  }
  
  //set scores
  //console.log(challenge,body.sig);
  challenge.p1_score=0
  challenge.p2_score=0
  challenge.p1_landed=0
  challenge.p2_landed=0
  challenge.turn=1


  let k = await db.ref('games/').push().key;
  console.log(k)
  await db.ref(`games/${k}`).set(challenge);
  db.ref(`addresses/${signer}/games/${challenge.rival}/${k}`).set(true);
  db.ref(`addresses/${challenge.rival}/games/${signer}/${k}`).set(true);
    
  res.send({
    key:k,
    seed:seed
  })
});

  module.exports=router;