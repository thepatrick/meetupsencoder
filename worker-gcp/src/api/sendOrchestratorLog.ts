import nodeFetch from 'node-fetch';
import { curry } from 'ramda';
import pino, { Logger } from 'pino';

export type sendOrchestratorLogger = (
  level: string,
  message: string,
  info: unknown,
) => Promise<void>;

export const sendOrchestratorLog = curry(async (
  orchestratorToken: string,
  jobURL: string,
  logger: Logger,
  level: string,
  message: string,
  info: unknown,
): Promise<void> => {
  logger.info(message, info);
  const response = await nodeFetch(
    `${jobURL}/log`,
    {
      method: 'POST',
      headers: {
        'X-MEW-TOKEN': orchestratorToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        message,
        info,
      }),
    },
  );
  if (response.status > 400) {
    logger.error('Unexpected response status', { responseStatus: response.status });
  }
});
