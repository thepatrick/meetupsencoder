import { readFile } from 'fs';
import { all, where } from 'ramda';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export interface GSUtilCopyJob {
  src: string;
  dest: string;
}

export interface EncoderJob {
  downloads: GSUtilCopyJob[];
  meltCommand: string[];
  uploads: GSUtilCopyJob[];
}

const isNonEmptyString = (possible: unknown): possible is string => {
  return typeof possible === 'string' && possible.length > 0;
};

const isGSUtilCopyJob = (possible: unknown): possible is GSUtilCopyJob => {
  return where(
    {
      src: isNonEmptyString,
      dest: isNonEmptyString,
    },
    possible,
  );
};

const isValidMeltCommand = (possible: unknown): possible is string[] => {
  return Array.isArray(possible) && possible.length > 0 && all(isNonEmptyString, possible);
};

const isEncoderJob = (possibleEncoderJob: unknown): possibleEncoderJob is EncoderJob => {

  return where(
    {
      downloads: all(isGSUtilCopyJob),
      meltCommand: isValidMeltCommand,
      uploads: all(isGSUtilCopyJob),
    },
    possibleEncoderJob,
  );
};

export const loadJob = async (jobFile: string): Promise<EncoderJob> => {
  const data = await readFileAsync(jobFile);
  const possibleEncoderJob = JSON.parse(data.toString());
  if (isEncoderJob(possibleEncoderJob)) {
    return possibleEncoderJob;
  }

  throw new Error('Job is not valid');
};
