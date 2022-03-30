const router = require('express').Router();
// let ethers=require("ethers");

let assets=require("../sk8ers.json")

router.get('/:asset?', (req, res)=>{

  if(!req.params.asset){
    res.send({
      name:`MINT SK8R`,
      img:"https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_skeleton_1.mp4?alt=media",
      "animation_url":"https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_skeleton_1.mp4?alt=media"
    })
  }

  let zeros=5-req.params.asset.toString().length;
  let zeroString="";
  for(i=0;i<zeros;i++){
    zeroString+="0"
  }
  res.send({
    name:`SK8R #${zeroString}${req.params.asset}`,
    "attributes": [
      { "trait_type": "Status", "value": "Unrevealed" }
    ],
    img:"https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_all3.mp4?alt=media",
    "animation_url":"https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_all3.mp4?alt=media"
  })

  // let asset= assets[req.params.asset];
  // asset.img=`https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/testFolder%2F${req.params.asset}_pfp.png?alt=media`
  // asset["animation_url"]=`https://playsk8.wl.r.appspot.com/gallery/${req.params.asset}`
  // res.send(asset)
});
module.exports=router;