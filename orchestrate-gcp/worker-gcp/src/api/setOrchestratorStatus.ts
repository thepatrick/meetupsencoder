import nodeFetch from 'node-fetch';
import { curry } from 'ramda';
import { JobStatus } from './JobStatus';
import { Logger } from 'pino';

export const setOrchestratorStatus = curry(async (
  logger: Logger,
  orchestratorToken: string,
  jobURL: string,
  status: JobStatus,
): Promise<void> => {
  logger.info('Setting status', { status });
  const response = await nodeFetch(
    `${jobURL}/status`,
    {
      method: 'POST',
      headers: {
        'X-MEW-TOKEN': orchestratorToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
      }),
    },
  );
  if (response.status > 400) {
    logger.error('Unexpected response status', { responseStatus: response.status });
    throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);
  }
  logger.trace('Updated status', { status });
});
