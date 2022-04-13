const router = require('express').Router();
// let ethers=require("ethers");

let assets=require("../sk8ers.json")

router.get('/:asset?', (req, res)=>{

  if(!req.params.asset||Number(req.params.asset)>3000){
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
  //console.log(req.params.asset)
  let asset= assets[req.params.asset];
  asset.img="https://storage.googleapis.com/playsk8.appspot.com/pfp/" + req.params.asset + "_pfp.png"
  asset["animation_url"]=`https://playsk8.wl.r.appspot.com/gallery/${req.params.asset}`
  res.send(asset)

});
module.exports=router;