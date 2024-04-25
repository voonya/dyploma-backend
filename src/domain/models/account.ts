import { BaseModel } from './base';

export class Account extends BaseModel {
  name: string;
  password: string;
  phoneNumber: string;
}