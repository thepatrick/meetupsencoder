import { generateStartupScript } from './generateStartupScript';
import Compute from '@google-cloud/compute';
import nanoid = require('nanoid');

const metadata = (key: string, value: string) => ({
  key,
  value,
});

// GET ${jobURL}/config
// POST ${jobURL}/status {
//  status: 'EncoderDownloading' | 'Encoding' | 'Uploading' | 'Finished' | 'Failed' }

export const createCloudWorker = async (
  compute: Compute,
  selfURL: string,
  jobId: string,
  secret: string,
): Promise<[string, Promise<unknown>]> => {
  const jobURL = `${selfURL}/api/v1/job/${jobId}`;
  const instanceName = `encoder-${jobId}-worker-${nanoid(4).toLowerCase()}`;
  const generatedStartupScript = generateStartupScript(jobURL, secret);

  console.log('-----------------------------');
  console.log(generatedStartupScript);
  console.log('-----------------------------');

  const zone = compute.zone('australia-southeast1-b'); // b, c, a

  const config = {
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
        metadata('cos-update-strategy', 'update_disabled'),
        metadata('live-twopats-crofter-job-url', jobURL),
        metadata('live-twopats-crofter-secret', secret),
        metadata('startup-script', generatedStartupScript),
      ],
    },
    serviceAccounts: [
      {
        email: 'twopats-live-uploader@thepatrick-io.iam.gserviceaccount.com',
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
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
  };

  console.log('config', config);

  throw new Error('Not ready to do this for reals yet');

  // Start the VM create task
  // const [, operation] = await zone.createVM(instanceName, config);

  // return [instanceName, operation.promise()];
};
