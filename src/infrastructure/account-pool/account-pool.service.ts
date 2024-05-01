import { Injectable, OnModuleInit } from '@nestjs/common';
import { AccountRepository } from '../repository/entities/account';
import { AccountClientTelegram } from './account-client';

@Injectable()
export class AccountPoolService implements OnModuleInit {
  private _clients: AccountClientTelegram[];

  constructor(private readonly accountsRepository: AccountRepository) {}

  async onModuleInit() {
    await this._initClients();
  }

  private async _initClients() {
    const accounts = await this.accountsRepository.getAll();

    this._clients = accounts.map((account) => new AccountClientTelegram(account));

    await Promise.all( this._clients.map(client => client.initialyzeAsync()));
  }  

  public getAccounts(): AccountClientTelegram[] {
    return this._clients;
  }
}
