import { execAsync } from './execAsync';
import { Logger } from 'pino';
import { curry } from 'ramda';

export const gsutilCopy = curry(
  async (
    logger: Logger,
    src: string,
    dest: string,
  ): Promise<void> => {
    const cmd = 'gsutil';
    const args = [
      '-m',
      'cp',
      src,
      dest,
    ];

    return execAsync(logger, cmd, args);
  },
);
