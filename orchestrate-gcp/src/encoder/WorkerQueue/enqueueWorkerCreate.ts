import shortid from 'shortid';
import { DatabasePoolConnectionType, sql } from 'slonik';
import { WorkerQueueAction } from './WorkerQueueAction';

export const enqueueCreate = async (
  connection: DatabasePoolConnectionType,
  jobId: string,
): Promise<void> => {
  await connection.query(sql`
    INSERT INTO worker_queue (
      worker_queue_item_id,
      retries_remaining,
      time_created,
      job_id,
      action,
    ) VALUES (
      ${shortid.generate()},
      3,
      NOW(),
      ${jobId},
      ${WorkerQueueAction.Create}
    )
  `);
};
