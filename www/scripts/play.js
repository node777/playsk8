
let play={
    getZeros(asset){
        asset=asset.toString().length
        let zeros=5-asset;
        let zeroString="";
        for(i=0;i<zeros;i++){
            zeroString+="0"
        }
        return zeroString

    },
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
            <div class="sk8r pointer rounded center topBottomPad" onclick="window.location='https://opensea.io/collection/playsk8-official'">
                
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
        //console.log(play.assets[sk8r]["token_id"])
        play.sk8r=play.assets[sk8r]["token_id"]
        game.sk8r=play.sk8r
        if(game.key){
            location.hash=`game?${game.key}`
        }else{
            console.log("no game playing")
            game.rival?play.startGame():location.hash=`challenge`
        }

        
        //play.currentChallenge?play.currentChallenge.sk8r=play.assets[asset]["token_id"]:play.currentChallenge={sk8r:play.assets[asset]};
        
    },
    async challenge(to){
        if(!to){
            to=document.getElementById("addressSearch").value
        }
        to=to.toLowerCase()
        if(to==window.ethereum.selectedAddress.toLowerCase()){
            alert("cannot challenge self")
            return
        }
        game={
            rival:to,
            startTime:Date.now()
        }

        //console.log(game.sk8r)
        game.sk8r||game.sk8r===0?play.startGame():location.hash=`selectSk8r`

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
        //console.trace(ret);
        if(ret=="No data available"){
            return 0
        }else{
            game=ret
            console.log("game found", ret)
            return 1
        }
    },
    async startGame(){
        
        let ret=await play.createGame()
        game.key=ret.key

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
        console.log(trick)
        game.board=="flipped"?game.p2_sk8r=game.sk8r:game.p1_sk8r=game.sk8r
        game.lastTrick=trick
        //location.hash="loading"
        let gameSnip={
            trick:trick,
            timestamp:Date.now(),
            sk8r: game.sk8r,
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
        await alert(t);
        document.getElementById("p1_status").innerHTML=trick.toUpperCase()
        play.changeAnimation(trick)
        lux.changePage()

    },
    changeAnimation(trick,p2){
        console.log(p2);
        if(p2?!game.p2_sk8r:!game.p1_sk8r){
            p2?game.p2_sk8r=game.sk8r:game.p1_sk8r=game.sk8r
        }
        let zeroString=play.getZeros(p2?game.p2_sk8r:game.p1_sk8r)
        let trickSource="https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_all3.mp4?alt=media/"
        if(!p2){
            
            if(game.p1_sk8r){
                trickSource=trick?`https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${game.p1_sk8r}_v03/${game.p1_sk8r}_${game.p1_lastTrick?game.p1_lastTrick:"ollie"}_${game.p1_landed?"success":"fail"}.mov?alt=media`:`https://storage.googleapis.com/playsk8.appspot.com/pfp/${game.p1_sk8r}_pfp.png`
            }
        }else{
            if(game.p2_sk8r){
                trickSource=trick?`https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${game.p2_sk8r}_v03/${game.p2_sk8r}_${game.p2_lastTrick?game.p2_lastTrick:"ollie"}_${game.p2_landed?"success":"fail"}.mov?alt=media`:`https://storage.googleapis.com/playsk8.appspot.com/pfp/${game.p1_sk8r}_pfp.png`
            }
        }
        if(game.board=="flipped"^p2){
            document.getElementById("rivalTrickSource").src=trickSource
            document.getElementById("rival").load();
            document.getElementById("rival").play();
            console.log(trickSource);
        }else{
            document.getElementById("trickSource").src=trickSource
            document.getElementById("challenger").load();
            document.getElementById("challenger").play();
        }
    },
    getGameInfo(callback){
        
        if(game.key){
            let key=game.key
            console.log(game)
            gamedata= firebase.database().ref('games/' + key);
            setTimeout(()=>{
                play.gameDataListener=gamedata.on('value', (snapshot) => {
                    
                    if (snapshot.exists()) {
                        let gameSnap=snapshot.val();
                        console.log(gameSnap)
                        

                        let key=game.key
                        // const sk8r=Number(`${play.sk8r}`)


                        //console.log(gameSnap, sk8r)
                        //get start
                        game=gameSnap
                        //console.log(gameSnap, sk8r)
                        game.key=key
                        game.sk8r=play.sk8r;
                        //console.log(game,sk8r)
                        play.updateGame();
                    }else{
                        console.log("Snapshot does not exist");
                    }
                });
            },100);
        }else{
            play.startGame()
        }
    },
    async updateGame(){

        //check if user is in game
        game.playing=window.ethereum.selectedAddress.toLowerCase()==game.p1 || window.ethereum.selectedAddress.toLowerCase()==game.p2

        if(game.winner){
            document.getElementById("status").innerHTML=`Player ${game.winner} wins`
        }
        
        //check if user is p1 or p2
        if(game.playing){
            //flip game board if user is p2
            window.ethereum.selectedAddress.toLowerCase()==game.p2?game.board="flipped":console.log("user is p1")

            //console.log(play.sk8r)
            //delete game.sk8r
            game.sk8r=play.sk8r;

            // console.log(game.sk8r)
            //if its your turn
            if(game.board=="flipped"?game.turn==2:game.turn==1){

                //check if user has not selected sk8r yet
                if(game.sk8r==undefined||game.sk8r=='undefined'||!game.sk8r){
                    //prompt user to select sk8r
                    alert("please select SK8R")
                    location.hash="selectSk8r"
                    return
                }else{
                    //game.sk8r=game.board=="flipped"?game.p2_sk8r:game.p1_sk8r
                    game.lastTrick=game.board=="flipped"?game.p2_lastTrick:game.p1_lastTrick
                }

                //let trickSource=`https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${sk8r}_v03/${sk8r}_${Object.keys(play.sk8rData.tricks)[0]}_success.mov?alt=media`
    
                //display tricks
                document.getElementById('p1_tricks').innerHTML=await elements.tricks()
    

            }
            //if its not your turn
            else{
                document.getElementById("status").innerHTML="Waiting on opponent"
            }
        }
        //if user is not in game 
        else{
            //do nothing
        }

        

        //display last trick
        let p1last=game.p1_lastTrick||"No trick played"
        let p2last=game.p2_lastTrick||"No trick played"
        document.getElementById("p1_status").innerHTML=game.board=="flipped"?p2last:p1last;
        document.getElementById("p2_status").innerHTML=game.board=="flipped"?p1last:p2last;
        play.changeAnimation(game.p1_lastTrick?game.p1_lastTrick:false)
        play.changeAnimation(game.p2_lastTrick?game.p2_lastTrick:false,1)

        for(i=1;i<=3;i++){
            console.log(i, game.p1_score, game.p2_score)
            if(game.board=="flipped"?game.p1_score>=i:game.p2_score>=i){
                document.getElementById(`playerLetter${i}`).style="color:#ff7676"
            }
            if(game.board=="flipped"?game.p2_score>=i:game.p1_score>=i){
                document.getElementById(`rivalLetter${i}`).style="color:#ff7676"
            }
        }

        //display usernames and addresses
        document.getElementById("playerAddress").innerHTML=`${game.board=="flipped"?game.p2.substring(0, 5):game.p1.substring(0, 5)}...`;
        document.getElementById("rivalAddress").innerHTML=`${game.board=="flipped"?game.p1.substring(0, 5):game.p2.substring(0, 5)}...`;
        document.getElementById("playerUsername").innerHTML=`${game.board=="flipped"?"Player 2":"Player 1"}`
        document.getElementById("rivalUsername").innerHTML=`${game.board=="flipped"?"Player 1":"Player 2"}`

    }
}

let game={}

window.ethereum.selectedAddress?"":play.connectWallet()