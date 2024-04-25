import { Account } from './account';
import { BaseModel } from './base';
import { Post } from './post';

export class PostOperation extends BaseModel {
  account: Account;
  post: Post;
  reaction?: string;
  comment?: string;
}