import { JobProfile, isValidJobProfile } from './JobProfile';
import { isNonEmptyString } from '../../utils/isNonEmptyString';
import { map, where, isNil } from 'ramda';
import { isNumber } from 'util';
import { JobClip, isValidJobClip } from './JobClip';

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
