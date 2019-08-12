export interface Group {
  groupId: string;
  brand: string;
};

export interface GroupUser {
  groupId: string;
  userSub: string;
}

export interface Event {
  eventId: string;
  groupId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  startTime: Date;
  endTime: Date;
};

export interface Talk {
  talkId: string;
  groupId: string;
  eventId: string;
  title: string;
  fps: number;
};

export interface TalkPresenter {
  talkPresnterId: string;
  talkId: string;
  email: string;
}
