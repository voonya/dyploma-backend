import { BaseModel } from './base';

export class Account extends BaseModel {
  name: string;
  phoneNumber: string;
  session: string;
  apiId: number;
  apiHash: string;
}
