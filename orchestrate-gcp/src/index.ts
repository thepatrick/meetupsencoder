import { Storage } from '@google-cloud/storage';
import { map, pipe } from 'ramda';
import { timeFromFileName } from './utils/time';
import { listFiles } from './listFiles';
import { userData } from './userData';
import { findSourcesForClip } from './findSourcesForClip';

const storage = new Storage();

interface Job {
  bucket: string;
  encoderId: string;
  clips: string[][];
  fps: number;
  profile: string;
  fileName: string;
}

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
