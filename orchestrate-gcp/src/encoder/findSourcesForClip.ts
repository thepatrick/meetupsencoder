import { curry } from 'ramda';
import { fileNameFromTime } from '../utils/time';
import { MeltFile } from './MeltFile';

export const findSourcesForClip = curry(
  (files: number[], fps: number, [start, end]: number[]): MeltFile[] => {
    const pickedFiles = files.filter((element, index) => {
      if (element > end) {
        return false;
      }
      if (
        element < start && // we are before the start timestamp
        index + 1 < files.length && // there are more files
        files[index + 1] < start // the next file is also before the start timestamp
      ) {
        return false;
      }
      // In that case we must be one of the desired files!
      return true;
    });

    const meltFiles = pickedFiles.map((file, index) => {
      const meltFile: MeltFile = {
        fileName: fileNameFromTime(file),
      };
      if (file < start) {
        meltFile.in = ((start - file)) * fps;
      }

      if (index === pickedFiles.length - 1) {
        meltFile.out = ((end - file)) * fps;
      }

      return meltFile;
    });

    return meltFiles;
  },
);
