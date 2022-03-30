const router = require('express').Router();
// let ethers=require("ethers");

let assets=require("../sk8ers.json")

router.get('/:asset', (req, res)=>{
  if(!req.params.asset||Number(req.params.asset)>3000){
    res.send("asset not availible")
  }

  let zeros=5-req.params.asset.toString().length;
  let zeroString="";
  for(i=0;i<zeros;i++){
    zeroString+="0"
  }
  let options=""
  for(trick in assets[req.params.asset].tricks){
    //console.log(trick)
    options+=`<option value="${trick}">${trick.charAt(0).toUpperCase() + trick.slice(1)}</option>`
  }
    let pfpLink="https://storage.googleapis.com/playsk8.appspot.com/pfp/" + req.params.asset + "_pfp.png"

    res.send(`
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Play&display=swap');
      body{
        margin:0;
      }
      #selector{
        position:absolute;
        top:16px;
        left:16px;
        z-index:2;
        font-family: 'Play', sans-serif;
        
      }
      select{
        
        background-color: #010001;
        color: white;
        font-family: 'Play', sans-serif;
        font-size:16px;
      }
      img, video{
        height:100%;
        width:auto;
      }
      @media (orientation: portrait) {
        
        img, video{
          height:auto;
          width:100%;
        }
      }
    </style>
    <div id="selector">
      <select id="viewSelect" onchange="changeView()">
        <option value="pfp">Profile Photo</option>
        ${options}
      </select>
    </div>
    
    <img id="pfpImg" src="${pfpLink}" />
    <video id="trickVideo" style="display:none" controls autoplay loop>
        <source id="trickSource" type="video/mp4">
    </video>
    <script>
    let zeroString='${zeroString}'
      let selectedSk8r='${req.params.asset}'
      function changeView(view){
        let viewSelection=document.getElementById("viewSelect").value;
        //console.log(trick)
        if(viewSelection=="pfp"){
          document.getElementById("trickVideo").style="display:none;"
          document.getElementById("pfpImg").style="display:initial;"
        }else{
          document.getElementById("pfpImg").style="display:none;"
          document.getElementById("trickSource").src="https://storage.googleapis.com/playsk8.appspot.com/v03_animations/" + zeroString + selectedSk8r + "_v03/" + selectedSk8r + "_" + viewSelection + "_success.mov?alt=media";
          document.getElementById("trickVideo").style="display:initial;"
          document.getElementById("trickVideo").load();
          document.getElementById("trickVideo").play();

        }
      }
    </script>
    `)
  });
  module.exports=router;