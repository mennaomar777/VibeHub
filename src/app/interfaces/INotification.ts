export interface NotificationUser {
  _id: string;
  name: string;
  photo: string;
}

export interface NotificationCommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface NotificationComment {
  _id: string;
  content: string;
  commentCreator: NotificationCommentCreator;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
}

export interface NotificationEntity {
  _id: string;
  body: string;
  user: string;
  commentsCount: number;
  topComment: NotificationComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export interface UnavailableNotificationEntity {
  _id: string;
  unavailable: true;
}
export type NotificationEntityData =
  | NotificationEntity
  | UnavailableNotificationEntity;

export interface INotification {
  _id: string;
  recipient: NotificationUser;
  actor: NotificationUser;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: NotificationEntityData;
}
