import Compute from '@google-cloud/compute';
import { Logger } from 'pino';
import { generateStartupScript } from './generateStartupScript';
import generate from 'nanoid/generate';

const metadata = (key: string, value: string) => ({
  key,
  value,
});

export const createCloudWorker = async (
  logger: Logger,
  compute: Compute,
  selfURL: string,
  jobId: string,
  orchestatorToken: string,
): Promise<[string, Promise<unknown>]> => {
  const jobURL = `${selfURL}/api/v1/job/${jobId}`;
  const instanceID = generate('0123456789abcdefghijklmnopqrstuvwxyz', 4);
  const instanceName = `encoder-${jobId.toLowerCase()}-worker-${instanceID}`;
  const generatedStartupScript = generateStartupScript(jobURL, orchestatorToken);

  logger.info('generatedStartupScript', { generatedStartupScript });

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
        metadata('cos-update-strategy', 'update_disabled'),
        metadata('live-twopats-crofter-job-url', jobURL),
        metadata('live-twopats-crofter-orchestator-token', orchestatorToken),
        metadata('user-data', generatedStartupScript),
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
  });

  logger.info('VM created');

  return [instanceName, operation.promise()];
};
