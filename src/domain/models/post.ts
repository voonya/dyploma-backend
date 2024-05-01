import { BaseModel } from './base';
import { Channel } from './channel';

export class Post extends BaseModel {
  idInSocial: string;
  channel?: Channel;
  msg: string;
  socialCreationDate: Date;
  isPropagandaPredicted?: boolean;
  isPropaganda: boolean | null;
  topicWords?: string | null;
  msgCleared?: string | null;
}
