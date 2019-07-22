// import { Storage } from '@google-cloud/storage';
// import { commandFromJob } from '../encoder/commandFromJob';
// import { userData } from '../encoder/userData';
// import { asyncMain } from '../utils/asyncMain';
// import { JobProfile } from '../encoder/Job';

// asyncMain(async () => {
//   const storage = new Storage();
//   const jobFile = await commandFromJob(storage, {
//     bucket: 'video.twopats.live',
//     encoderId: 'standalone',
//     clips: [
//       // ['2019-06-19/18_12_50', '2019-06-19/18_50_00'],
//       ['2019-06-19/18_51_00', '2019-06-19/19_13_00'],
//     ],
//     fps: 25,
//     profile: JobProfile.atsc_1080p_25,
//     fileName: 'encodes/test.mp4',
//   });

//   const generatedUserData = userData(jobFile);

//   console.log(generatedUserData);
// });
