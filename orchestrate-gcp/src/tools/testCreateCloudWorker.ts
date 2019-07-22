import { asyncMain } from '../utils/asyncMain';
import { createCloudWorker } from '../encoder/createCloudWorker';
// tslint:disable-next-line: import-name
import Compute from '@google-cloud/compute';

asyncMain(async () => {
  await createCloudWorker(
    new Compute(),
    'http://localhost',
    'test-job',
    'super-secret-value',
  );

  console.log('Bye');
});
