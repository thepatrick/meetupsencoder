export enum JobStatus {
  NeedsEncoder = 'NeedsEncoder',
  EncoderCreating = 'EncoderCreating',
  EncoderCreated = 'EncoderCreated',
  EncoderDownloading = 'EncoderDownloading',
  Encoding = 'Encoding',
  Uploading = 'Uploading',
  Finished = 'Finished',
  Failed = 'Failed',
}

export const isValidJobStatus = (
  possible: unknown,
): possible is JobStatus => {
  if (typeof possible !== 'string') {
    return false;
  }

  switch (possible) {
    case JobStatus.NeedsEncoder:
    case JobStatus.EncoderCreating:
    case JobStatus.EncoderCreated:
    case JobStatus.EncoderDownloading:
    case JobStatus.Encoding:
    case JobStatus.Uploading:
    case JobStatus.Finished:
    case JobStatus.Failed:
      return true;
    default:
      return false;
  }
};
