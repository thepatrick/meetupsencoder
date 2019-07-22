import { userData } from './userData';
// tslint:disable-next-line: import-name
import Compute from '@google-cloud/compute';
import nanoid = require('nanoid');

export const createCloudWorker = async (
  compute: Compute,
  selfURL: string,
  jobId: string,
  secret: string,
): Promise<string> => {
  const jobURL = `${selfURL}/api/v1/job/${jobId}/config`;
  const instanceName = `encoder-${jobId}-worker-${nanoid(4).toLowerCase()}`;

  const generatedStartupScript = userData(jobURL, secret);

  console.log('-----------------------------');
  console.log(generatedStartupScript);
  console.log('-----------------------------');

  const zone = compute.zone('australia-southeast1-b'); // b, c, a

  // Start the VM create task
  const [, operation] = await zone.createVM(instanceName, {
    machineType: 'n1-standard-8',
    tags: ['live-twopats-crofter-encoder'],
    scheduling: {
      preemptible: true,
    },
    disks: [
      {
        type: 'PERSISTENT',
        boot: true,
        mode: 'READ_WRITE',
        autoDelete: true,
        deviceName: instanceName,
        initializeParams: {
          sourceImage: 'projects/cos-cloud/global/images/cos-stable-75-12105-97-0',
          // diskType: 'projects/thepatrick-io/zones/australia-southeast1-b/diskTypes/pd-standard',
          diskSizeGb: '10',
        },
        diskEncryptionKey: {},
      },
    ],
    metadata: {
      items: [
        {
          key: 'cos-update-strategy',
          value: 'update_disabled',
        },
        {
          key: 'live-twopats-crofter-job-url',
          value: jobURL,
        },
        {
          key: 'live-twopats-crofter-secret',
          value: secret,
        },
        {
          key: 'startup-script', // or user-data?
          value: generatedStartupScript,
        },
      ],
    },
    serviceAccounts: [
      {
        email: 'twopats-live-uploader@thepatrick-io.iam.gserviceaccount.com',
        scopes: [
          'https://www.googleapis.com/auth/cloud-platform',
        ],
      },
    ],
    networkInterfaces: [
      {
        network: 'global/networks/default',
        accessConfigs: [
          {
            type: 'ONE_TO_ONE_NAT',
            name: 'External NAT',
            networkTier: 'premium',
          },
        ],
      },
    ],
  });

  console.log('Creating instance...');

  // `operation` lets you check the status of long-running tasks.
  const output = await operation.promise();

  console.log(output);

  console.log('Instance probably created.');

  return instanceName;
};
