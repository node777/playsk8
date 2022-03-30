let elements={
    splash(){
        let r=``
        if(window.ethereum.selectedAddress){
            //r+= elements.dashboard()
        }
        r+= `
                <div class="flex">
                    <div class="padding">
                        <h2>Discover, Collect, and SK8</h2>



                        PLAYSK8 is the Raddest NFT  Game in the Metaverse<br><br>
                        <img src="assets/welcome.gif" /><br>
                        Please connect your wallet.
                        <div class="button v2 w20" onclick="location.hash='selectSk8r'">CONNECT WALLET</div>
                    </div>
                    <div>

                        <video id="trickVideo" class="rounded" style="display: initial;" controls="" autoplay loop="">
                            <source id="trickSource" type="video/mp4" src="https://storage.googleapis.com/playsk8.appspot.com/v03_animations/00047_v03/47_kickflip_success.mov?alt=media">
                        </video>
                        <div class="info roundedBottom">
                            <img class="pfp inBl" src="./assets/bonez.webp" />
                            <div class="inBl infoSq">
                                <b>BONEZ</b>
                                <br>0x69a...
                            </div>
                            <img class="icon floatRight inBl" src="./assets/spinner.gif" />
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Notable Sk8rs</h2>
                    <div class="flex">
                        <div class="rounded notable">
                            <img class="rounded" src="assets/bonez.webp" />
                            <div class="info2">
                                <b>BONEZ</b>
                            </div>
                        </div>
                        <div class="rounded notable">
                            <img class="rounded" src="assets/johnny.webp" />
                            <div class="info2">
                                <b>Johnny</b>
                            </div>
                        </div>
                        <div class="rounded notable">
                            <img class="rounded" src="assets/jenny.webp" />
                            <div class="info2">
                                <b>Jenny</b>
                            </div>
                        </div>
                    </div>
                </div>

            `
        
        return r
    },
    404(){
        return this.splash()
    },
    connectingWallet:`
        <div class="center">
            <img class="loader" src="./assets/spinner.gif" />
            <div class="subtle">Connecting wallet...</div>
        </div>
    `,
    async selectSk8r(){
        //console.log(params)
        await play.connectWallet()
        await play.getAssets()
    },
    sk8r(asset){
        return `
            <div class="br v2"></div>    
        <div class="sk8r pointer rounded" onclick="play.select(${asset})">
            <iframe class="roundedTop" src="gallery/${play.assets[asset]["token_id"]}" ></iframe>
            <div class="sk8rInfo">${play.assets[asset].name}</div>
            <div class="trickInfo flex">
                <div>
                    Ollie<br>
                    Pop Shuvit<br>
                    Kickflip<br>
                </div>
                <div class="right"><b>
                    89%<br>
                    85%<br>
                    79%<br>
                </b></div>
            </div>
        </div>
            
        `
    },
    async sk8rSelected(params){
        let asset=params[1]
        console.log(asset);
        let zeros=5-play.assets[asset]["token_id"].toString().length;
        let zeroString="";
        for(i=0;i<zeros;i++){
            zeroString+="0"
        }
        let r=await fetch(`/metadata/${play.assets[asset]["token_id"]}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
        })
        let a=await r.json()
        console.log(a);
        let trickDisplay=""
        for(trick in a.tricks){
            trickDisplay+=`
            <div class="pointer" onclick="play.challenge('${location.hash.split("?")[1]}','${play.assets[asset]["token_id"]}','${trick}')">
                <h3 class="left">${trick.charAt(0).toUpperCase()}${trick.slice(1)}</h3>

                <video class="trickVideo left" autoplay loop>
                        <source type="video/mp4" src="https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${play.assets[asset]["token_id"]}_v03/${play.assets[asset]["token_id"]}_${trick}_success.mov?alt=media">
                </video>
            </div>`
        }
        return `
            You have selected ${play.assets[asset]["name"]}
            <div class="br"></div>
            <iframe src="gallery/${play.assets[asset]["token_id"]}" id="sk8rDisplay" ></iframe>
            <div class="br"></div>
                Please select opening trick:
                <div class="flex w1">
                    ${trickDisplay}
                    
                </div>
            <div class="br"></div>

            <div class="button" onclick="location.hash=''">Home</div>
        `
    },
    dashboard(){
        return elements.splash()
        return `
        <div class="left">
            Browse Sk8ers
            <div class="button" onclick="location.hash='selectSk8r'">View Sk8ers</div>
            Challenge
            <div class="button" onclick="location.hash='newChallenge'">New Challenge</div>
            View Leaderboard
            <div class="button" onclick="">Leaderboard</div>
            Sign Out
            <div class="button" onclick="">Sign Out</div>
        </div>
        `
    },
    newChallenge(){
        return `
            <div>
                Enter User's Address.
                <div class="br"></div>
                <input id="challengeAddress" placeholder="address"></input>
                <div class="br"></div>
                <div class="button" onclick="let to=document.getElementById('challengeAddress').value; location.hash='selectSk8r?'+to">Challenge</div>
                <div class="button" onclick="location.hash=''">Home</div>
            </div>
        `
    },
    async challengeIssued(){
        return await elements.selectSk8r()
    },
    async game(params){
        // game.rival?play.startGame():location.hash=`challenge`
        // game.sk8r||game.sk8r==0?play.startGame():location.hash=`selectSk8r`

        console.log(params)

        //load game data
        game.key=params[1]
        await bitprint.load()
        await play.getGameInfo()

        return `
            <div class="rounded" id="gameBox">
                <div id="gameHead">
                    <h1>PLAY<b>SK8</b></h1>
                    Game 1
                </div>
                <div class="flex vCenter">
                    <div id="p1_controls" class="playerControls">
                        <div class="left">
                            <video class="circle" autoplay loop>
                                    <source id="" type="video/mp4" src="https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_all3.mp4?alt=media">
                            </video>
                            <h3>@bonezarmy</h3>
                            0xb2s....
                        </div>
                        <div id="p1_tricks"></div>
                    </div>
                    <div class="player">
                        <div class="sk8r rounded">
                            <video  id="challenger" class="trickVideo left roundedTop" autoplay loop>
                                    <source id="trickSource" type="video/mp4" src="">
                            </video>
                            <div class="trickInfo" id="p1_trick">
                                ${"Please select Trick"}
                            </div>
                            <img src="assets/bar.webp" class="statusBar" />
                        </div>
                        <div class="letters flex">
                            <div id="playerLetter1">S</div>
                            <div id="playerLetter1">K</div>
                            <div id="playerLetter1">8</div>
                        </div>
                    </div>
                    <img src="assets/vs.gif" id="vs"/>
                    <div class="player">
                        <div class="sk8r rounded">
                            <video class="trickVideo left roundedTop" autoplay loop>
                                    <source id="enemyTrickSource" type="video/mp4" src="https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_all3.mp4?alt=media">
                            </video>
                            <div class="trickInfo" >
                                <!--
                                    SK8R:<br />
                                    Pending...<br><br>
                                    TRICK:<br />
                                -->
                                Unknown
                            </div>
                            <img src="assets/bar.webp" class="statusBar" />
                        </div>
                        <div class="letters flex">
                            <div id="enemyLetter1">S</div>
                            <div id="enemyLetter1">K</div>
                            <div id="enemyLetter1">8</div>
                        </div>
                    </div>

                    <div class="playerControls">
                        
                        <div class="left">
                            <video class="circle" autoplay loop>
                                    <source type="video/mp4" src="https://firebasestorage.googleapis.com/v0/b/playsk8.appspot.com/o/sk8_backlight_all3.mp4?alt=media">
                            </video>
                            <h3>@jennyblock</h3>
                            0xb2s....
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    tricks(){
        
        let zeros=5-game.sk8r.toString().length;
        let zeroString="";
        for(i=0;i<zeros;i++){
            zeroString+="0"
        }
        let trickDisplay=""
        for(trick in play.sk8rData.tricks){
            trickDisplay+=`
            <div class="pointer" onclick="play.playTrick('${trick}')">
                
                <video class="trickVideo left" onmouseover="play.changeAnimation('${trick}')" autoplay loop>
                        <source id="" type="video/mp4" src="https://storage.googleapis.com/playsk8.appspot.com/v03_animations/${zeroString}${game.sk8r}_v03/${game.sk8r}_${trick}_success.mov?alt=media">
                </video>
                ${trick.charAt(0).toUpperCase()}${trick.slice(1)}
            </div>`
        }
        return trickDisplay
    },
    challenge(){
        let leaderboard=[

            {
                address:"0x360ADe0A8b3238d1a25EcA37aB1Cd2270F0AD3B3",
                wins:11,
                losses:12
            },
            {
                address:"0x360ADe0A8b3238d1a25EcA37aB1Cd2270F0AD3B3",
                wins:10,
                losses:11
            },
            {
                address:"0x360ADe0A8b3238d1a25EcA37aB1Cd2270F0AD3B3",
                wins:10,
                losses:11
            }
        ]
        let topPlayers=``
        for(player in leaderboard){
            topPlayers+=`
                <div class="br"></div>
                <div class="flex vCenter">
                
                    <div>                
                        ${Number(player)+1}
                    </div>
                    <div>    
                        <img class="pfp" src="assets/johnny.webp"/>
                    </div>
                    <div>
                        0x${leaderboard[player].address[2]}${leaderboard[player].address[3]}${leaderboard[player].address[4]}${leaderboard[player].address[5]}...
                    </div>
                    <div class="green">
                        ${leaderboard[player].wins}
                    </div>
                    <div class="red">
                        ${leaderboard[player].losses}
                    </div>
                    <div>
                        ${leaderboard[player].wins+leaderboard[player].losses}
                    </div>
                    <div>
                        <div class="button v2" onclick="play.challenge('${leaderboard[player].address}')">Challenge</div>
                    </div>
                </div>
            `
        }
        return `
        <div class="box">
            <img src="assets/challengePlayers.webp" />
            <img id="leaderboardGif" src="assets/leaderboard.gif" />
            <div id="leaderboard">
                <div class="flex">
                
                    <div>                
                        RANK
                    </div>
                    <div>    
                        PLAYER
                    </div>
                    <div>
                        Wallet Address
                    </div>
                    <div>
                        Wins
                    </div>
                    <div>
                        Losses
                    </div>
                    <div>
                        Total Games
                    </div>
                    <div>
                        Challenge
                    </div>
                </div>
                ${topPlayers}
            </div>
        </div>
        `
    },
    async games(){
        let gameDisplay

        await window.ethereum.enable()
        var myGames = firebase.database().ref('addresses/' + window.ethereum.selectedAddress.toLowerCase() + '/games');
        myGames.once('value', (snapshot) => {
            document.getElementById("playerGames")?document.getElementById("playerGames").innerHTML=`
            <div class="flex">
            
                <div>      
                    PLAYER 1
                </div>
                <div>    
                    PLAYER 2
                </div>
                <div>
                    PLAYER 1 Sk8r
                </div>
                <div>
                    PLAYER 2 Sk8r
                </div>
                <div>
                    Score
                </div>
                <div>
                    Start Date
                </div>
                <div>
                    Start Time
                </div>
                <div>
                    Play
                </div>
            </div>
            `:""
            const data = snapshot.val();
            console.log(data)
            for(add in data){
                for(g in data[add]){
                    gamedata= firebase.database().ref('games/' + g);
                    gamedata.on('value', (snapshot2) => {
                        let gameSnap=snapshot2.val();
                        console.log(gameSnap)
                        
                        //get start
                        start=new Date(gameSnap.startTime)
                        console.log(start)
                        document.getElementById("playerGames")?document.getElementById("playerGames").innerHTML+= `
                            <div class="br"></div>
                            <div onclick="location.hash='game?${g}'" class="flex vCenter">
                            
                                <div>    
                                    0x${gameSnap.challenger[2]}${gameSnap.challenger[3]}${gameSnap.challenger[4]}${gameSnap.challenger[5]}...      
                                </div>
                                <div>    
                                    0x${gameSnap.rival[2]}${gameSnap.rival[3]}${gameSnap.rival[4]}${gameSnap.rival[5]}...
                                </div>
                                <div>
                                    ${gameSnap.sk8r||"Not selected"}
                                </div>
                                <div>
                                    ${gameSnap.sk8r||"Not selected"}
                                </div>
                                <div>
                                    0-0
                                </div>
                                <div>
                                    ${start.toLocaleDateString()}
                                </div>
                                <div>
                                    ${start.toLocaleTimeString()}
                                </div>
                                <div>
                                    <div class="button v2" onclick="">Play</div>
                                </div>
                            </div>
                        `:""
                    });
                }
            }
            
        });
        return `
        
            <div class="box">
                <img src="assets/challengePlayers.webp" />
                <h2>My games</h2>
                <div id="playerGames" class="board pointer center">
                </div>
            </div>
        `
    }
}