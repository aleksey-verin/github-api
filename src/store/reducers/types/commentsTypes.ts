export interface IComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface IUserNewComment {
  postId: number;
  name: string;
  email: string;
  body: string;
}
