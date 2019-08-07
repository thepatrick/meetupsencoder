export interface Group {
  id: number;
  group_id: string;
  brand: string;
};

export interface Event {
  event_id: number;
  group_id: number;
  title: string;
  start_time: Date;
};

export interface Talk {
  talk_id: number;
  event_id: number;
  title: string;
  fps: number;
};

