import { GSUtilCopyJob, isGSUtilCopyJob } from './GSUtilCopyJob';
import { where, all } from 'ramda';
import { isNonEmptyString } from './isNonEmptyString';

export interface EncoderJob {
  downloads: GSUtilCopyJob[];
  meltCommand: string[];
  uploads: GSUtilCopyJob[];
}

const isValidMeltCommand = (possible: unknown): possible is string[] => {
  return Array.isArray(possible) && possible.length > 0 && all(isNonEmptyString, possible);
};

export const isEncoderJob = (possibleEncoderJob: unknown): possibleEncoderJob is EncoderJob =>
  where(
    {
      downloads: all(isGSUtilCopyJob),
      meltCommand: isValidMeltCommand,
      uploads: all(isGSUtilCopyJob),
    },
    possibleEncoderJob,
  );
