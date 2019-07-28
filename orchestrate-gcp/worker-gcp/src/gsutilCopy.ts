import { execAsync } from './execAsync';

export const gsutilCopy = async (src: string, dest: string): Promise<void> => {
  const cmd = 'gsutil';
  const args = [
    '-m',
    'cp',
    src,
    dest,
  ];

  return execAsync(cmd, args);
};
