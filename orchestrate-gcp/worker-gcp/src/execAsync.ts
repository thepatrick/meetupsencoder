import { spawn } from 'child_process';
import { curry } from 'ramda';
import { sendOrchestratorLogger } from './api/sendOrchestratorLog';

export const execAsync = curry(
  (
    logger: sendOrchestratorLogger,
    cmd: string,
    args: string[],
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      logger('info', `Spawning ${cmd}`, { args });

      const child = spawn(cmd, args, {
        cwd: process.cwd(),
        env: process.env,
      });

      child.stdout.on('data', chunk => logger('info', `[${cmd}] ${chunk}`, {}));
      child.stderr.on('data', chunk => logger('error', `[${cmd}] ${chunk}`, {}));

      child.on('close', (code) => {
        if (code === 0) {
          logger('info', `[${cmd}] completed`, {});
          resolve();
        } else {
          logger('error', `[${cmd}] Failed`, { code });
          reject(new Error(`${cmd} closed with code ${code}`));
        }
      });
    });
  },
);
