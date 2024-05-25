import { BaseModel } from './base';

export class User extends BaseModel {
  username: string;
  password: string;
}
