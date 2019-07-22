import { JobClip } from './JobClip';
import { JobProfile } from './JobProfile';

export interface Job {
  bucket: string;
  encoderId: string;
  clips: JobClip[];
  fps: number;
  profile: JobProfile;
  fileName: string;
}
