import { File, Storage } from '@google-cloud/storage';
import { extname } from 'path';

import { timeFromFileName } from './utils/time';
import { pipe, map, prop, filter, equals, replace } from 'ramda';

const isTS = pipe(
  extname,
  equals('.ts'),
);

export const listFiles = async (
  storage: Storage,
  bucketName: string,
  prefix: string): Promise<number[]> => {
  const [files] = await storage.bucket(bucketName).getFiles({ prefix /*   delimiter: '/', */ });
  const regex = new RegExp(`^${prefix}`);

  return pipe(
    map<File, string>(prop('name')),
    filter(isTS),
    map<string, number>(
      pipe(
        replace(regex, ''),
        timeFromFileName,
      ),
    ),
  )(files);
};
