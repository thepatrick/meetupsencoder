import { spawn } from 'child_process';
import { Logger } from 'pino';
import { curry } from 'ramda';

export const execAsync = curry(
  (
    logger: Logger,
    cmd: string,
    args: string[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const log = logger.child({ cmd });

      log.info(`Spawning ${cmd}`, { args });

      const child = spawn(cmd, args, {
        cwd: process.cwd(),
        env: process.env,
      });

      child.stdout.on('data', chunk => log.info(chunk));
      child.stderr.on('data', chunk => log.error(chunk));

      child.on('close', (code) => {
        if (code === 0) {
          log.info('completed');
          resolve();
        } else {
          log.error('Failed', { code });
          reject(new Error(`${cmd} closed with code ${code}`));
        }
      });
    });
  },
);
