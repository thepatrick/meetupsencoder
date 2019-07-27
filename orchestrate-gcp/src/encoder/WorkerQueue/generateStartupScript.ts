export const generateStartupScript = (
  jobURL: string,
  secret: string,
): string => {
  const storagePath = '/var/twopats-live-melt';

  return `#cloud-config

users:
- name: twopats-live-melt
  uid: 2000

write_files:
- path: /etc/systemd/system/twopats-live-melt.service
  permissions: 0644
  owner: root
  content: |
    [Unit]
    Description=Encodes a video

    [Service]
    ExecStart=/usr/bin/docker run --rm -u 2000 -v ${storagePath}:${storagePath}:ro \
      -e MEW_JOB_URL=${jobURL} \
      -e MEW_SECRET=${secret} \
      --name=twopats-live-melt thepatrick/melt
    ExecStop=/usr/bin/docker stop twopats-live-melt
    ExecStopPost=/usr/bin/docker rm twopats-live-melt

runcmd:
- systemctl daemon-reload
- systemctl start twopats-live-melt.service
`;
};

// tslint:disable-next-line: max-line-length
// curl -H 'Metadata-Flavor:Google' http://metadata.google.internal/computeMetadata/v1/instance/attributes/live-twopats-crofter-job-url
// tslint:disable-next-line: max-line-length
// curl -H 'Metadata-Flavor:Google' http://metadata.google.internal/computeMetadata/v1/instance/attributes/live-twopats-crofter-secret
