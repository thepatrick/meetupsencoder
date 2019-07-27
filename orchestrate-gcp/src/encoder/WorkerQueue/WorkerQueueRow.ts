import { WorkerQueueAction } from './WorkerQueueAction';
import { isNil, where } from 'ramda';
import { isNonEmptyString } from '../../utils/isNonEmptyString';

export interface WorkerQueueRow {
  workerQueueItemId: string;
  jobId: string;
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
      workerQueueItemId: isNonEmptyString,
      jobId: isNonEmptyString,
      action: (i: string) =>
        i === WorkerQueueAction.Create || i === WorkerQueueAction.Destroy,
    },
    possible,
  );
};
