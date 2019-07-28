import { pipe, map, prop, flatten, uniq, filter } from 'ramda';
import { MeltFile } from '../MeltFile';
import { createMeltCommand } from './createMeltCommand';
import { join } from 'path';

const extractUniqFiles = pipe(
  map(map<MeltFile, string>(prop('fileName'))),
  flatten as (x: string[][]) => string[],
  uniq,
);

export const generateEncoderConfiguration = (
  bucket: string,
  encoder: string,
  fileName: string,
  profile: string,
  sources: MeltFile[][],
): string => {
  const dataDirectory = '/var/twopats.live-encoder/';

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
