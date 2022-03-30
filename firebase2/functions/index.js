const functions = require('firebase-functions');
const admin = require("firebase-admin");
const path = require('path');
const fs = require('fs');
const os = require('os');
const unzip = require('unzipper')

admin.initializeApp();

const storage = admin.storage();


const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '2GB'
}

exports.unzip = functions.runWith(runtimeOpts).storage.object().onFinalize((object) => {

    return new Promise((resolve, reject) => {
        //console.log(object)
        if (object.contentType !== 'application/zip') {
          reject();
        } else {
          const bucket = firebase.storage.bucket(object.bucket)
          const remoteFile = bucket.file(object.name)
          const remoteDir = object.name.replace('.zip', '')

          console.log(`Downloading ${remoteFile}`)

          remoteFile.createReadStream()
            .on('error', err => {
              console.error(err)
              reject(err);
            })
            .on('response', response => {
              // Server connected and responded with the specified status and headers.
              //console.log(response)
            })
            .on('end', () => {
              // The file is fully downloaded.
              console.log("Finished downloading.")
              resolve();
            })
            .pipe(unzip.Parse())
            .on('entry', entry => {
              const file = bucket.file(`${remoteDir}/${entry.path}`)

              entry.pipe(file.createWriteStream())
              .on('error', err => {
                console.log(err)
                reject(err);
              })
              .on('finish', () => {
                console.log(`Finsihed extracting ${remoteDir}/${entry.path}`)
              });

              entry.autodrain();

            });
        }
    })

});