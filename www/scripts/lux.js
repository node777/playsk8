var lux={
    consoleEnabled:false,
    content:document.getElementById("content"),
    
    async changePage(page, event){
        //setup vars
        var hash=(location.hash||"#splash").split("#")[1];
        var params=hash.split("?");
        var p=params[0];

        //set body id
        document.body.id=hash
        
        //close sidebar
        console.trace(p)
        if(elements[p]){
            //lux.content.innerHTML=elements.loading;
            //console.log(hash)
            document.body.id = p;
            let t=typeof elements[p]
            if(t=="function"){
                let cont=await elements[p](params?params:null)
                //console.log(cont)
                if(cont){lux.content.innerHTML = cont}
            }
            else if(t=="string"){
                lux.content.innerHTML = elements[p]
            }
            else if(hash=="splash"){

            }
            else{
                lux.content.innerHTML = elements["404"]()
            }

        }else{
            fetch(`./pages/${hash}.lml`).then(async(res)=>{
                if(res.ok){
                    let ret =``
                    let r = await res.text()
                    r=r.split("~~");

                    for(chunk in r){
                        (chunk%2!==0)?eval(r[chunk]):ret+=r[chunk]
                    }

                    lux.content.innerHTML = eval('`'+ret+'`')
                }else{
                    lux.content.innerHTML = elements["404"]()
                }
                
            })
        }
        
    },
    setup: async function(){
        // let s=["header","sidebar","footer"]
        // for(i in s){
        //     console.log(i)
        //     document.getElementById(s[i]).innerHTML=elements[s[i]];
        // }
        // await bitprint.load();
        window.addEventListener("hashchange", this.changePage, false);
        lux.changePage();
    },
    element(e){
        fetch(`./elements/${e}.lml`).then(async(r)=>{
            r=(r.ok)?await r.text():""
            return r
        });
    }
}
window.ethereum?.on('accountsChanged', function (accounts) {
    lux.changePage();
  });
lux.setup();