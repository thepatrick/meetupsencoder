import { Storage } from '@google-cloud/storage';
import { join } from 'path';
import { filter, flatten, map, pipe, prop, uniq } from 'ramda';
import { timeFromFileName } from '../utils/time';
import { findSourcesForClip } from './findSourcesForClip';
import { Job } from './Job';
import { listFiles } from './listFiles';
import { MeltFile } from './MeltFile';

const createMeltCommand = (
  profile: string,
  sources: any,
  outputFilename: string,
  audioCodec = 'aac',
  videoCodec = 'libx264',
): string[] => {
  return [
    '-profile', profile,
  ].concat(flatten(sources))
    .concat([
      '-consumer', `avformat:${outputFilename}`, `acodec=${audioCodec}`, `vcodec=${videoCodec}`,
    ]);
};

const extractUniqFiles = pipe(
  map(map<MeltFile, string>(prop('fileName'))),
  flatten as (x: string[][]) => string[],
  uniq,
);

export const generateJobFile = (
  bucket: string,
  encoder: string,
  fileName: string,
  profile: string,
  sources: MeltFile[][],
): string => {
  const dataDirectory = '/var/lib/twopats.live-encoder/';

  const files: string[] = extractUniqFiles(sources);

  const encodeFiles = map(
    map(
      source => filter(Boolean)([
        join(dataDirectory, source.fileName),
        source.in ? `in=${source.in}` : undefined,
        source.out ? `out=${source.out}` : undefined,
      ]),
    ),
    sources,
  );

  const encodedFile = join(dataDirectory, 'encoded.mp4');

  const meltCommand = createMeltCommand(
    profile,
    encodeFiles,
    encodedFile,
    'aac',
    'libx264',
  );

  const downloads = map(
    i => ({ src: `gs://${bucket}/${encoder}/${i}`, dest: join(dataDirectory, i) }),
    files,
  );

  const uploads = [
    { src: encodedFile, dest: `gs://${bucket}/${fileName}` },
  ];

  return JSON.stringify({ downloads, meltCommand, uploads }, null, 2);
};

export const commandFromJob = async (storage: Storage, {
  bucket,
  encoderId,
  clips,
  fps,
  profile,
  fileName,
}: Job): Promise<string> => {
  const files = await listFiles(storage, bucket, `${encoderId}/`);

  const sources = map(
    pipe(
      map(timeFromFileName),
      findSourcesForClip(files, fps),
    ),
    clips,
  );

  const jobFile = generateJobFile(
    bucket, encoderId, fileName, profile, sources,
  );

  return jobFile;
};
