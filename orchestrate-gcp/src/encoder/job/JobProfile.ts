export enum JobProfile {
  atsc_1080p_25 = 'atsc_1080p_25',
  hdv_720_25p = 'hdv_720_25p',
}

export const isValidJobProfile = (
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
