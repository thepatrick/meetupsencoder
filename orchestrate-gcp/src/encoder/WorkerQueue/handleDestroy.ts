import { DatabasePoolType } from 'slonik';
import { Logger } from 'pino';
import { WorkerQueueRow } from './WorkerQueueRow';
import Compute from '@google-cloud/compute';
import { getJob, updateJobInstanceName } from '../job/JobService';
import { isNil } from 'ramda';

export const handleDestroy = async (
  logger: Logger,
  pool: DatabasePoolType,
  compute: Compute,
  workerQueueRow: WorkerQueueRow,
) =>
  pool.connect(async (connection) => {
    const { jobId } = workerQueueRow;

    logger.info(`Should destroy cloud instance for ${jobId}`);

    const { cloudInstanceName, status } = await getJob(connection, jobId);

    if (isNil(cloudInstanceName)) {
      logger.error(`Job ${jobId} currently has no cloud instance, cannot destory it`);
      return;
    }

    const zone = compute.zone('australia-southeast1-b'); // b, c, a

    const [operation, apiResponse] = await zone.vm(cloudInstanceName).delete();

    logger.info('Requested delete', apiResponse);

    await operation.promise();

    logger.info('Delete finished');

    await updateJobInstanceName(
      connection,
      jobId,
      null,
      status,
    );
  });
