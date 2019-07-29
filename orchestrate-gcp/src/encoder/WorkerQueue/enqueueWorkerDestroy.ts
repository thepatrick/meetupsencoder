import shortid from 'shortid';
import { DatabasePoolConnectionType, sql } from 'slonik';
import { WorkerQueueAction } from './WorkerQueueAction';

export const enqueueWorkerDestroy = async (
  connection: DatabasePoolConnectionType,
  jobId: string,
): Promise<void> => {
  await connection.query(sql`
    INSERT INTO worker_queue (
      "workerQueueItemId",
      "retriesRemaining",
      "timeCreated",
      "jobId",
      "action"
    ) VALUES (
      ${shortid.generate()},
      3,
      NOW(),
      ${jobId},
      ${WorkerQueueAction.Destroy}
    )
  `);
};
