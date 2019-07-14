export interface Job {
  bucket: string;
  encoderId: string;
  clips: string[][];
  fps: number;
  profile: string;
  fileName: string;
}
