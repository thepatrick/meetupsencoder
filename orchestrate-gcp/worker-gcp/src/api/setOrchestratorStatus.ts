import nodeFetch from 'node-fetch';
import { curry } from 'ramda';
import { JobStatus } from './JobStatus';

export const setOrchestratorStatus = curry(async (
  orchestratorToken: string,
  jobURL: string,
  status: JobStatus,
): Promise<void> => {
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
    throw new Error(`Unexpected response: ${response.status} ${response.statusText}`);
  }
});
