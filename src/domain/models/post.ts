import { BaseModel } from './base';
import { Channel } from './channel';
import { Topic } from './topic';

export class Post extends BaseModel {
  idInSocial: string;
  channel?: Channel;
  msg: string;
  socialCreationDate: Date;
  isPropagandaPredicted?: boolean;
  isPropaganda: boolean | null;
  topic?: Topic;
  msgCleared?: string | null;
}
