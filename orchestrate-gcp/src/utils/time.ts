import { basename, dirname } from 'path';
import moment, { unix } from 'moment';

export const timeFromFileName = (filePath: string): number => {
  const fileTime = basename(filePath, '.ts');
  const fileDirectory = dirname(filePath);
  return moment(`${fileDirectory} ${fileTime}`, 'YYYY-MM-DD HH_mm_ss').unix();
};

export const fileNameFromTime = (time: number): string => {
  return `${unix(time).format('YYYY-MM-DD/HH_mm_ss')}.ts`;
};
