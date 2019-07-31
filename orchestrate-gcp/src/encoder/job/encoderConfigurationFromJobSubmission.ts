import { Storage } from '@google-cloud/storage';
import { map, pipe } from 'ramda';
import { timeFromFileName } from '../../utils/time';
import { findSourcesForClip } from './findSourcesForClip';
import { listFiles } from '../listFiles';
import { JobSubmission } from './JobSubmission';
import { generateEncoderConfiguration } from './generateEncoderConfiguration';
import { NoClipsFoundError } from './NoClipsFoundError';

export const encoderConfigurationFromJobSubmission = async (
  storage: Storage,
  bucket: string,
  fileName: string,
  {
    encoderId,
    clips,
    fps,
    profile,
  }: JobSubmission): Promise<string> => {
  const files = await listFiles(storage, bucket, `${encoderId}/`);

  if (files.length === 0) {
    throw new NoClipsFoundError();
  }

  const sources = map(
    pipe(
      map(timeFromFileName),
      findSourcesForClip(files, fps),
    ),
    clips,
  );

  const encoderConfiguration = generateEncoderConfiguration(
    bucket, encoderId, fileName, profile, sources,
  );

  return encoderConfiguration;
};
