const firebaseConfig = {
    apiKey: "AIzaSyDX0PrbtBoeOj6XMP_BlqeJ9EMptX7XQTQ",
    authDomain: "playsk8.firebaseapp.com",
    databaseURL: "https://playsk8-default-rtdb.firebaseio.com",
    projectId: "playsk8",
    storageBucket: "playsk8.appspot.com",
    messagingSenderId: "1033335410277",
    appId: "1:1033335410277:web:955fd507c941e5a7c1c08c"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
let play={
    async connectWallet(){
        document.getElementById("content").innerHTML=elements.connectingWallet;
        await contract.connect()
        //document.getElementById("address").innerHTML=await contract.signer.getAddress();
        //document.getElementById("content").innerHTML=await elements.dashboard();
        await bitprint.load();

    },
    async getAssets(){
        if(!window.ethereum){
            await setTimeout(()=>{
                alert("Please connect web3 provider")
                
            },1000)
        }
        if(!window.ethereum.selectedAddress){
            await window.ethereum.enable()
        }
        let r=await fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=0xa1f11abb5b1874942cf09c96f0536b783e492e7f&owner=${window.ethereum.selectedAddress}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': '29930174fbb94c91bd30a31e79153922'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        let a=await r.json()
        play.assets=a.assets
        console.log(play.assets)
        let sk8rSelect=`
        
        `
        for(asset in play.assets){
            sk8rSelect+=elements.sk8r(asset)
        }
        sk8rSelect+=`
            <div class="sk8r pointer rounded center topPad" onclick="window.location='https://opensea.io/collection/playsk8-official'">
                
                <h1>+</h1>
                <h2>Add Sk8r</h2>
                <img src="./assets/opensea.webp" />
                
            </div>
        `
        document.getElementById("content").innerHTML=`
            Please select your sk8r.
            <div class="subtle">You currently have x SK8Rs</div>
            <div id="sk8rSelect">${sk8rSelect}</div>
        `
    },
    async getSk8rData(){
        await play.getGameInfo()
        
        // console.log(sk8r)
        //if there is a rival go back to game
        
    },
    async select(sk8r){
        game?"":game={}
        game.sk8r=play.assets[sk8r]["token_id"]

        game.rival?play.startGame():location.hash=`challenge`
        
        //play.currentChallenge?play.currentChallenge.sk8r=play.assets[asset]["token_id"]:play.currentChallenge={sk8r:play.assets[asset]};
        
    },
    async challenge(to){

        game.rival=to
        game.startTime=Date.now()

        console.log(game.sk8r)
        game.sk8r||game.sk8r==0?play.startGame():location.hash=`selectSk8r`

    },
    async checkGame(){
        
        let r=await fetch('/play/check', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body:JSON.stringify({
                from:window.ethereum.selectedAddress,
                to:game.rival
            })
        });
        let ret= await r.text()
        if(ret=="No data available"){
            return 0
        }else{
            return 
        }
    },
    async startGame(){
        let gameData=await play.checkGame()
            if(gameData==0){
                let ret=await play.createGame()
                game.key=ret.key
            }else{
                game.key=gameData
            }
            location.hash=`game?${game.key}`
            lux.changePage()
    },
    async createGame(){
        
        //location.hash="loading"
        let sig= await bitprint.sign(JSON.stringify(game))
        
        let r=await fetch('/play/create', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body:JSON.stringify({
                sig:sig,
                challenge:game
            })
        });
        let ret=await r.json();
        console.log(ret)
        return ret
    },
    async playTrick(trick){
        game.lastTrick=trick
        //location.hash="loading"
        let gameSnip={
            trick:trick,
            timestamp:Date.now(),
            key:game.key
        }
        let sig= await bitprint.sign(JSON.stringify(gameSnip))
        
        let r=await fetch('/play/trick', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body:JSON.stringify({
                sig:sig,
                game:gameSnip
            })
        });
        let t=await r.text()
        alert(t);
        document.getElementById("p1_trick").innerHTML=trick.toUpperCase()
        play.changeAnimation(trick)

    },
    changeAnimation(trick){
        let zeros=5-game.sk8r.toString().length;
        let zeroString="";
        for(i=0;i<zeros;i++){
            zeroString+="0"
        }
        console.log(trick)
        document.getElementById("trickSource").src=`https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${game.sk8r}_v03/${game.sk8r}_${trick}_success.mov?alt=media`
        document.getElementById("challenger").load();
        document.getElementById("challenger").play();
    },
    getGameInfo(callback){
        
        if(game.key){
            let key=game.key
            gamedata= firebase.database().ref('games/' + key);
                gamedata.on('value', (snapshot) => {
                    let gameSnap=snapshot.val();
                    console.log(gameSnap)
                    
                    //get start
                    game=gameSnap
                    game.key=key
                    play.updateGame();
                });
        }else{
            play.startGame()
        }
    },
    async updateGame(){
        //getSk8rData
        let r=await fetch(`/metadata/${game.sk8r}`, {
            method: 'GET' // *GET, POST, PUT, DELETE, etc.
        })
        
        play.sk8rData=await r.json()

        play.changeAnimation(game.lastTrick)
        //let trickSource=`https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${sk8r}_v03/${sk8r}_${Object.keys(play.sk8rData.tricks)[0]}_success.mov?alt=media`

        document.getElementById("p1_tricks").innerHTML=elements.tricks()

        console.log(game)
    }
}

let game={}

window.ethereum.selectedAddress?"":play.connectWallet()