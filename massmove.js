const {Storage} = require('@google-cloud/storage');
//$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Sabin\Desktop\Dev\sk8\secrets\playsk8-firebase-adminsdk-hrlbt-4cf4095fb0.json"
// Creates a client
const storage = new Storage();
let bucketName="playsk8.appspot.com"

async function moveFile(num) {
  // Moves the file within the bucket
  let zeros=5-num.toString().length;
  let zeroString="";
  for(i=0;i<zeros;i++){
    zeroString+="0"
  }
  let srcFileName=`v03_animations/${zeroString}${num}_v03`
  //let destFileName=`pfp/${num}_pfp.png`
  await storage.bucket(`${bucketName}/${srcFileName}`).setMetadata({
    iamConfiguration: {
      publicAccessPrevention: 'enforced',
    },
  })
  //await storage.bucket(bucketName).file(srcFileName).move(destFileName);

//   console.log(
//     `gs://${bucketName}/${srcFileName} moved to gs://${bucketName}/${destFileName}`
//   );
}
async function fullMove(){
    let unmoved=[]
    for(i=3001;i<=3002;i++){
        await moveFile(i).catch((error)=>{
            console.log(error);
            unmoved.push(i)
        });
            
    }
    console.log(unmoved)
}

fullMove()