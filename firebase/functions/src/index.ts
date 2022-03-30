import * as functions from 'firebase-functions';
// import * as unzipper from 'unzipper';

// export const manageZipArchives = functions
//   .runWith({ timeoutSeconds: 300 })
//   .storage.bucket()
//   .object()
//   .onFinalize(async (obj: functions.storage.ObjectMetadata) => {
//     const file = firebase
//       .storage()
//       .bucket(obj.bucket)
//       .file(obj.name!);

//     // We only want to deal with ZIP archives
//     if (!file.name.endsWith('.zip')) {
//       return;
//     }

//     await file
//       .createReadStream()
//       .pipe(unzipper.Parse())
//       .on('entry', entry => {
//         const destination = firebase
//           .storage()
//           .bucket()
//           .file(`${file.name.replace('.', '_')}/${entry.path}`);
//         entry.pipe(destination.createWriteStream());
//       })
//       .promise();

//     await file.delete();
//   });