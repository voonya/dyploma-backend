import { BaseModel } from './base';
import { Channel } from './channel';

export class Reaction extends BaseModel {
  reaction: string;
  rank: number;
}