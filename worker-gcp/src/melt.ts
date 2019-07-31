import { spawn } from 'child_process';
import { curry, is } from 'ramda';
import { sendOrchestratorLogger } from './api/sendOrchestratorLog';

export const melt = curry(
  (
    logger: sendOrchestratorLogger,
    args: string[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      logger('info', 'Spawning melt', { args });

      const child = spawn('melt', args, {
        cwd: process.cwd(),
        env: process.env,
      });

      let lastProgress = 0;
      const regexp = /Current Frame:\s+[0-9]+, percentage:\s+([0-9]+)/;
      const checkIfProgress = (chunk: any) => {
        let chunkString;
        if (is(Buffer, chunk)) {
          chunkString = chunk.toString() as string;
        } else if (typeof chunk === 'string') {
          chunkString = chunk;
        }
        if (!chunkString) {
          logger('info', `Melt: ${chunk}`, {});
        } else {
          const progress = chunkString.match(regexp);
          if (progress) {
            const newProgress = parseInt(progress[1], 10);
            if (lastProgress !== newProgress) {
              lastProgress = newProgress;
              logger('info', `Melt progress: ${newProgress}%`, {});
            }
          } else {
            logger('info', `Melt: ${chunk}`, {});
          }
        }
      };

      child.stdout.on('data', checkIfProgress);
      child.stderr.on('data', checkIfProgress);

      child.on('close', (code) => {
        if (code === 0) {
          logger('info', '[melt] completed', {});
          resolve();
        } else {
          logger('error', '[melt] Failed', { code });
          reject(new Error(`melt closed with code ${code}`));
        }
      });
    });
  },
);
