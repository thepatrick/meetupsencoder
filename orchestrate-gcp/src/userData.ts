import { join } from 'path';
import { filter, flatten, map, pipe, prop, uniq } from 'ramda';
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

  const jobFile = '/etc/twopats-live-melt-job.json';

  return `#cloud-config

users:
- name: twopats-live-melt
  uid: 2000

write_files:
- path: ${jobFile}
  permissions: 0644
  owner: root
  content: |
    ${JSON.stringify({ downloads, meltCommand, uploads }, null, 2).split('\n').join('\n    ')}
- path: /etc/systemd/system/twopats-live-melt.service
  permissions: 0644
  owner: root
  content: |
    [Unit]
    Description=Encodes a video

    [Service]
    ExecStart=/usr/bin/docker run --rm -u 2000 -v ${jobFile}:${jobFile}:ro \
      --name=twopats-live-melt thepatrick/melt ${jobFile}
    ExecStop=/usr/bin/docker stop twopats-live-melt
    ExecStopPost=/usr/bin/docker rm twopats-live-melt

runcmd:
- systemctl daemon-reload
- systemctl start twopats-live-melt.service
`;

};

/*
# Create working directory
mkdir -p ${dataDirectory}

cat > ${jobFile} <<EOF
${JSON.stringify({ downloads, meltCommand, uploads }, null, 2)}
EOF

docker run --rm -it \
  -v ${dataDirectory}:${dataDirectory} \
  thepatrick/melt \
  ${jobFile}

gcloud compute instances create INSTANCE_NAME \
    --image cos-stable-75-12105-97-0 \
    --metadata-from-file user-data=FILENAME
*/
