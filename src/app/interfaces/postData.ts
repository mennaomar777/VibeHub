export interface PostData {
  comments: Comment[];
  user: User;
  _id: string;
  id?: string;
  body: string;
  image?: string;
  commentCreator: User;
  post: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  photo?: string;
}

export interface Comment {
  _id: string;
  id?: string;
  content: string;
  commentCreator: User;
  post: string;
  createdAt: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  createdAt: string;
}
