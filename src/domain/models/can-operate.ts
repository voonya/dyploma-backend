import { Account } from './account';
import { BaseModel } from './base';
import { Channel } from './channel';

export class CanOperate extends BaseModel {
  channel: Channel;
  account: Account;
  canReact: boolean;
  canComment: boolean;
}