export const userData = (
  jobFile: string,
): string => {

  const jobFilePath = '/etc/twopats-live-melt-job.json';

  return `#cloud-config

users:
- name: twopats-live-melt
  uid: 2000

write_files:
- path: ${jobFilePath}
  permissions: 0644
  owner: root
  content: |
    ${jobFile.split('\n').join('\n    ')}
- path: /etc/systemd/system/twopats-live-melt.service
  permissions: 0644
  owner: root
  content: |
    [Unit]
    Description=Encodes a video

    [Service]
    ExecStart=/usr/bin/docker run --rm -u 2000 -v ${jobFilePath}:${jobFilePath}:ro \
      --name=twopats-live-melt thepatrick/melt ${jobFilePath}
    ExecStop=/usr/bin/docker stop twopats-live-melt
    ExecStopPost=/usr/bin/docker rm twopats-live-melt

runcmd:
- systemctl daemon-reload
- systemctl start twopats-live-melt.service
`;

};

/*
gcloud compute instances create INSTANCE_NAME \
    --image cos-stable-75-12105-97-0 \
    --metadata cos-update-strategy=update_disabled \
    --metadata-from-file user-data=FILENAME
*/
