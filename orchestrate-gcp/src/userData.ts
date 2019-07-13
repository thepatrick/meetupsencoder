import { map, flatten, prop, pipe, uniq, filter } from 'ramda';
import { join } from 'path';
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

export const userData = (
  bucket: string,
  encoder: string,
  fileName: string,
  profile: string,
  sources: MeltFile[][],
): string => {
  const dataDirectory = '/srv/encoder/data/';

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
    i => `gsutil -m cp gs://${bucket}/${encoder}/${i} ${join(dataDirectory, i)}`,
    files,
  );

  return `#!/bin/bash

# Create working directory
mkdir -p ${dataDirectory}

# Download required video files
${downloads.join('\n')}

docker pull thepatrick/melt

docker run --rm -it -v ${dataDirectory}:${dataDirectory} thepatrick/melt ${meltCommand.join(' ')}

gsutil -m cp ${encodedFile} gs://${bucket}/${fileName}
  `;
};

/*

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common

    --assume-yes?

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

*/
