import Compute from '@google-cloud/compute';
import { DatabasePoolType, sql } from 'slonik';
import { createCloudWorker } from './createCloudWorker';
import { getJob, updateJobInstanceName, updateJobStatus } from '../job/JobService';
import { JobStatus } from '../job/JobStatus';
import { WorkerQueueAction } from './WorkerQueueAction';
import { isValidWorkerQueueRow, WorkerQueueRow } from './WorkerQueueRow';
import jsonwebtoken from 'jsonwebtoken';

const waitFor = (time: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, time);
});

const handleCreate = async (
  jwtSecret: string,
  pool: DatabasePoolType,
  compute: Compute,
  selfUrl: string,
  workerQueueRow: WorkerQueueRow,
) =>
  pool.connect(async (connection) => {
    const { jobId } = workerQueueRow;

    console.log('Should create cloud instance for', jobId);

    // TODO Check that we are actually still waiting for an encode...
    // const { secret } = await getJob(connection, jobId);

    const token = jsonwebtoken.sign(
      {
        jobId,
      },
      jwtSecret,
      {
        algorithm: 'HS512',
        expiresIn: '24h',
        subject: jobId,
      },
    );

    const [instanceName, operationPromise] = await createCloudWorker(
      compute,
      selfUrl,
      jobId,
      token,
    );

    await updateJobInstanceName(
      connection,
      jobId,
      instanceName,
      JobStatus.EncoderCreating,
    );

    await operationPromise;

    await updateJobStatus(connection, jobId, JobStatus.EncoderCreated);
  });

export const runWorkerQueue = async (
  pool: DatabasePoolType,
  compute: Compute,
  selfUrl: string,
  jwtSecret: string,
): Promise<void> => {
  while (true) {
    const hadWork = await pool.connect(async connection =>
      connection.transaction(async () => {
        const workerQueueItem = await connection.maybeOne(sql`
          UPDATE worker_queue wq1 SET "retriesRemaining" = "retriesRemaining" - 1
          WHERE wq1."workerQueueItemId" = (
            SELECT wq2."workerQueueItemId" FROM worker_queue wq2
            WHERE wq2."retriesRemaining" > 0
            ORDER BY wq2."timeCreated" FOR UPDATE SKIP LOCKED LIMIT 1
          )
          RETURNING
            wq1."workerQueueItemId" AS "workerQueueItemId",
            wq1."jobId" AS "jobId",
            wq1.action AS action
        `);

        if (isValidWorkerQueueRow(workerQueueItem)) {
          try {
            switch (workerQueueItem.action) {
              case WorkerQueueAction.Create:
                await handleCreate(
                  jwtSecret,
                  pool,
                  compute,
                  selfUrl,
                  workerQueueItem,
                );
                break;
              case WorkerQueueAction.Destroy:
                break;
            }
            await connection.query(sql`
              DELETE FROM worker_queue
              WHERE "workerQueueItemId" = ${workerQueueItem.workerQueueItemId}
            `);
          } catch (err) {
            console.error(
              `Handling queue item ${workerQueueItem.workerQueueItemId} failed`,
              err,
            );
          }
          return true;
        }
        return false;
      }),
    );
    await waitFor(hadWork ? 500 : 30000);
  }
};
