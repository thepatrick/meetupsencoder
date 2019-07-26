import { WorkerQueueAction } from './WorkerQueueAction';
import { isNil, where } from 'ramda';
import { isNonEmptyString } from '../../utils/isNonEmptyString';

export interface WorkerQueueRow {
  worker_queue_item_id: string;
  job_id: string;
  action: WorkerQueueAction;
}

export const isValidWorkerQueueRow = (
  possible: unknown,
): possible is WorkerQueueRow => {
  if (isNil(possible) || typeof possible !== 'object') {
    return false;
  }

  return where(
    {
      worker_queue_item_id: isNonEmptyString,
      job_id: isNonEmptyString,
      action: (i: string) =>
        i === WorkerQueueAction.Create || i === WorkerQueueAction.Destroy,
    },
    possible,
  );
};
