import { Storage } from '@google-cloud/storage';
import { map, pipe } from 'ramda';
import { findSourcesForClip } from './findSourcesForClip';
import { Job } from './Job';
import { listFiles } from './listFiles';
import { userData } from './userData';
import { timeFromFileName } from './utils/time';

const storage = new Storage();

const commandFromJob = async ({
  bucket,
  encoderId,
  clips,
  fps,
  profile,
  fileName,
}: Job): Promise<{ generatedUserData: string }> => {
  const files = await listFiles(storage, bucket, `${encoderId}/`);

  const sources = map(
    pipe(
      map(timeFromFileName),
      findSourcesForClip(files, fps),
    ),
    clips,
  );

  const generatedUserData = userData(bucket, encoderId, fileName, profile, sources);

  return { generatedUserData };
};

(async () => {
  const { generatedUserData } = await commandFromJob({
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

  console.log(generatedUserData);
})()
  .catch(err => console.error(err));

/*
  Container-Optimized OS 75-12105.97.0 stable
  Kernel: ChromiumOS-4.14.111
  Kubernetes: 1.13.6
  Docker: 18.09.7
  Family: cos-stable
  Secure Boot ready
*/
