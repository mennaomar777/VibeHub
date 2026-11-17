export interface PostData {
  comments?: Comment[];
  topComment?: Comment | null;
  commentsCount?: number;
  likesCount?: number;
  likes?: string[];
  bookmarked?: boolean;
  bookmarksCount?: number;
  user: User;
  _id: string;
  id?: string;
  body: string;
  image?: string;
  createdAt: string;
  isLiked?: boolean;
  isShare?: boolean;
  sharesCount?: number;
  sharedPost?: PostData | null;
}

export interface User {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}

export interface PostLike extends User {
  id?: string;
}

export interface Comment {
  _id: string;
  id?: string;
  content: string;
  image?: string;
  commentCreator: User;
  post: string;
  createdAt: string;
  parentComment?: string | null;
  repliesCount?: number;
  likes?: string[];
  likesCount?: number;
  isLiked?: boolean;
}

export interface UserData {
  _id: string;
  name: string;
  username?: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover?: string;
  bookmarks?: string[];
  followers?: string[];
  following?: string[];
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}
