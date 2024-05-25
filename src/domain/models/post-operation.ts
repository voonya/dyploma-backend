import { Account } from './account';
import { BaseModel } from './base';
import { Post } from './post';
import { Reaction } from './reaction';
import { TopicMessage } from './topic-message';

export class PostOperation extends BaseModel {
  account: Account;
  post: Post;
  reaction?: Reaction;
  comment?: TopicMessage;
}
