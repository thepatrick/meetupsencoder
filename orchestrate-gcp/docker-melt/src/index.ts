import { spawn } from 'child_process';
import { loadJob } from './loadJob';

const log = (first: unknown, ...rest: unknown[]) => {
  console.log(`${new Date()}: ${first}`, ...rest);
};

const execAsync = (cmd: string, args: string[]): Promise<void> => {
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

const gsutilCopy = async (src: string, dest: string): Promise<void> => {
  const cmd = 'gsutil';
  const args = [
    '-m',
    'cp',
    src,
    dest,
  ];

  return execAsync(cmd, args);
};

(async () => {
  if (process.argv.length < 3) {
    throw new Error('Job not specified. (node dist/index.js path/to/job.json)');
  }

  const jobFile = process.argv[2];

  log('Hello', process.argv);

  const job = await loadJob(jobFile);

  log('Job', job);

  for (const download of job.downloads) {
    await gsutilCopy(download.src, download.dest);
  }

  await execAsync('melt', job.meltCommand);

  for (const upload of job.uploads) {
    await gsutilCopy(upload.src, upload.dest);
  }

  // if on GCP: shutdown self
})()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  });
