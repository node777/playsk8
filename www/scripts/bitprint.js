var bitprint = {
    account:{},
    //called on app load get acc data
    load:async()=>{
      //get provider
      bitprint.provider = await new ethers.providers.Web3Provider(window.ethereum);
      //get signer
      bitprint.signer = await bitprint.provider.getSigner();
    
      //display add
      setTimeout(async()=>{
        
//         let r=await fetch(`https://api.opensea.io/user/${window.ethereum.selectedAddress}`, {
//             method: 'GET', // *GET, POST, PUT, DELETE, etc.
//             mode: 'cors', // no-cors, *cors, same-origin
//             cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//             credentials: 'same-origin', // include, *same-origin, omit
//             headers: {
//               "Access-Control-Allow-Origin":  "http://localhost:8080",
//               "Access-Control-Allow-Methods": "POST",
//               'Access-Control-Allow-Credentials': 'true',
// // "Access-Control-Allow-Headers": Content-Type, Authorization
//             'Content-Type': 'application/json',
//             'X-API-KEY': '29930174fbb94c91bd30a31e79153922'
//             // 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             redirect: 'follow', // manual, *follow, error
//             referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//         });
        let address=bitprint.provider?.provider?.selectedAddress
        //console.log(address,r.json());
        document.getElementById("address").innerHTML=`${address?`0x${address[2]}${address[3]}${address[4]}${address[5]}...`:""}`;
      },300)
    },
    //save acc data to localstorage
    save:()=>{
      if(bitprint.account.type){
        localStorage.account=JSON.stringify(bitprint.account);
      }
    },
    //fetch acc key, prompt sig on key, populate bitprint.account.data with acc data returned from server if this is EMAIL ACC
    async getUser(callback){
        if(bitprint.account.type){
            //get user to query
            let p={
                type:bitprint.account.type,
                address:bitprint.provider.provider.selectedAddress
            }
            //if user is logged in with email send email
            p.type=="email"?()=>{p.email=bitprint.account.email}:""

            let accountStatus=await fetch('auth/user', {
              method: 'post',
              body: JSON.stringify(p)
            })
            
            accountStatus = await accountStatus.text();
            console.log(accountStatus);
            
            if(accountStatus=="true"){
              //get auth token
              p.tokenRequest=true;
              hux.post('/auth/user',JSON.stringify(p),async(res)=>{
                  //sign auth token
                  let token=res;
                  p.sig=await bitprint.sign(`Login ${token}`);
                  //console.log(res,p)
                  console.log(p)
                  //make reqest for data
                  hux.post('/auth/user',JSON.stringify(p),(res2)=>{
                      console.log(res2);
                      if(res2!=false&&res2!="false"){
                          bitprint.account.data=JSON.parse(res2)
                          bitprint.save();
                      }
                      callback(res2)
                  });
                  
              })
            }else{
              hux.editAccountPopup();
            }
        }else{
            
        }
    },
    //read User Data
    async loadAccount(){
        bitprint.getUser((res)=>{
            console.log(bitprint.account.data, res)
            if(bitprint.account.data==undefined){
                lux.popup(elements.createAccount)
            }else{
                document.getElementById("accountData").innerHTML=elements.accountData();
            }
        })
        
    },
    //write user data
    editAccount:(info)=>{
        bitprint.account.data={...bitprint.account.data, ...info};
        bitprint.save();
        //setup XML
        let ip= `/auth/user`;
        let tokenReqParams={
            "address":bitprint.provider.provider.selectedAddress,
            "tokenRequest":true
        }
        var authTokenReq=new XMLHttpRequest();
        authTokenReq.onreadystatechange =async function() {
            if(this.readyState == 4 && this.status == 200) {
            //get auth token
            console.log(this.responseText);
            let authToken=this.responseText;

            //sign auth token
            //info.timestamp=Date.now();
            let sig= await bitprint.sign(`Account edit ${authToken}`);
            


            //setup req data
            
            let reqData={
                data:info,
                sig:sig,
                address:bitprint.provider.provider.selectedAddress,
                type:bitprint.account.type,
                authToken:authToken
            }

            //setup xml
            var x = new XMLHttpRequest();
            x.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText)
                }
            };
            
            x.open("POST", ip, true);
            x.setRequestHeader("Content-type", "text/plain");
            x.send(JSON.stringify(reqData));
            }
        };
        authTokenReq.open("POST", ip, true);
        authTokenReq.setRequestHeader("Content-type", "text/plain");
        authTokenReq.send(JSON.stringify(tokenReqParams));
    
    },
    verify(type, v){
      let p = {
        address:bitprint.wallet?.address||bitprint.provider.provider.selectedAddress
      }
      p.type=type;
      p.code=v;
      var x = new XMLHttpRequest();
      x.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert(x.responseText);
        }
      }
      x.open("POST", '/auth/verify');
      x.setRequestHeader("Content-type", "text/plain");
      x.send(JSON.stringify(p));
    },
    //connect to an account
    connect:async(t)=>{
        if(t=="web3"){
            if(bitprint.account.type){
                hux.account();
            }
            else{
                bitprint.account={
                    type:"web3"
                }
                bitprint.provider = new ethers.providers.Web3Provider(window.ethereum);
                bitprint.signer = bitprint.provider.getSigner();
                bitprint.save();
                hux.connect();
            }
        }else if(t=="torus"){
        
            bitprint.account={
                type:"torus"
            }
            hux.load();
            torus = new Torus();
            await torus.init();
            torus.login().then(()=>{
                web3 = new Web3(torus.provider);
                bitprint.provider = new ethers.providers.Web3Provider(torus.provider);
                bitprint.provider.provider.selectedAddress=torus.provider.selectedAddress;

                bitprint.signer = bitprint.provider.getSigner();
                bitprint.save();
                lux.changePage();
            });
        
        }else if(t=="create"){
            bitprint.account={
                type:"key"
            }    
            bitprint.save();
            let wallet = ethers.Wallet.createRandom();
            localStorage.privateKey=wallet.privateKey;
            bitprint.load();
        }else if(t=="email"){
            //get ip
            let ip="auth/user"
            //get email
            let email=document.getElementById("email").value;
            //generate wallet
            bitprint.wallet = await ethers.Wallet.createRandom();
            localStorage.privateKey=bitprint.wallet.privateKey;
            bitprint.account={
                type:"email",
                email:email
            }
            bitprint.save()
            let address=bitprint.wallet.address
            //setup post req params 
            let p={
                "email":email,
                "address":address,
                "connect":1
            }
            console.log(p)
            //request passwordless auth
            var x = new XMLHttpRequest();
            x.open("POST", ip);
            x.setRequestHeader("Content-type", "text/plain");
            x.send(JSON.stringify(p));
            console.log( x.responseText);
        }
    },
    //sign msg
    sign:async(msg)=>{
      //if web3
        try{
          if(bitprint.signer["_address"]==null){
            
          }
          let signature = await bitprint.signer.signMessage(msg);
          console.log(signature);
          return signature;
        }
        catch(e){
          console.log(e);
          alert(`Could not sign message \n Got Error ${e}`)
          return "unsigned"
        }
    },
    clear:()=>{
      if(bitprint.account.type=="torus"){
        torus.logout();
      }
      localStorage.clear();
      bitprint.account=null;
      
      location.reload();
    }

}