import { isNil, where, map } from 'ramda';
import { isNonEmptyString } from '../utils/isNonEmptyString';
import { isNumber } from 'util';

export type JobClip = [string, string];

export interface Job {
  bucket: string;
  encoderId: string;
  clips: JobClip[];
  fps: number;
  profile: JobProfile;
  fileName: string;
}

const isValidJobClip = (
  possible: unknown,
): possible is JobClip => {
  return Array.isArray(possible) &&
    where(
      {
        0: isNonEmptyString,
        1: isNonEmptyString,
      },
      possible,
    );
};

export enum JobProfile {
  atsc_1080p_25 = 'atsc_1080p_25',
  hdv_720_25p = 'hdv_720_25p',
}

const isValidJobProfile = (
  possible: unknown,
): possible is JobProfile => {
  if (typeof possible !== 'string') {
    return false;
  }

  switch (possible) {
    case JobProfile.atsc_1080p_25:
    case JobProfile.hdv_720_25p:
      return true;
    default:
      return false;
  }
};

export interface JobSubmission {
  fileName: string;
  encoderId: string;
  clips: JobClip[];
  fps: number;
  profile: JobProfile;
}

export const isValidJobSubmission = (
  possible: unknown,
): possible is JobSubmission => {
  if (isNil(possible) || typeof possible !== 'object') {
    throw new Error('Job is not an object');
    // return false;
  }

  return where(
    {
      fileName: isNonEmptyString,
      encoderId: isNonEmptyString,
      clips: map(isValidJobClip),
      fps: isNumber,
      profile: isValidJobProfile,
    },
    possible,
  );
};
