import { log } from './log';
import { spawn } from 'child_process';

export const execAsync = (cmd: string, args: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {

    log(`Spawning ${cmd} [${args}]`);

    const child = spawn(cmd, args, {
      cwd: process.cwd(),
      env: process.env,
    });

    child.stdout.on('data', chunk => log(`[${cmd}]: [LOG] ${chunk}`));
    child.stderr.on('data', chunk => log(`[${cmd}]: [ERR] ${chunk}`));

    child.on('close', (code) => {
      if (code === 0) {
        log(`${cmd} completed`);
        resolve();
      } else {
        log(`${cmd} failed`);
        reject(new Error(`${cmd} closed with code ${code}`));
      }
    });
  });
};
