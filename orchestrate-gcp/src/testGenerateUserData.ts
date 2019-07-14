import { Storage } from '@google-cloud/storage';
import { commandFromJob } from './commandFromJob';
import { userData } from './userData';
import { asyncMain } from './utils/asyncMain';

asyncMain(async () => {
  const storage = new Storage();
  const jobFile = await commandFromJob(storage, {
    bucket: 'video.twopats.live',
    encoderId: 'standalone',
    clips: [
      // ['2019-06-19/18_12_50', '2019-06-19/18_50_00'],
      ['2019-06-19/18_51_00', '2019-06-19/19_13_00'],
    ],
    fps: 25,
    profile: 'atsc_1080p_25',
    fileName: 'encodes/test.mp4',
  });

  const generatedUserData = userData(jobFile);

  console.log(generatedUserData);
});

/*
  Container-Optimized OS 75-12105.97.0 stable
  Kernel: ChromiumOS-4.14.111
  Kubernetes: 1.13.6
  Docker: 18.09.7
  Family: cos-stable
  Secure Boot ready
*/
