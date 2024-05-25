import { Injectable, OnModuleInit } from '@nestjs/common';

import { AccountRepository } from '../../dal/entities/account';
import { AccountClientTelegram } from './account-client';
import { CreateAccountDto } from './dto/create-account.dto';
import { PaginationDto } from 'src/domain/dto/pagination.dto';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram';

@Injectable()
export class AccountPoolService implements OnModuleInit {
  private _clients: AccountClientTelegram[];

  constructor(private readonly accountsRepository: AccountRepository) {}

  async onModuleInit() {
    await this._initClients();
  }

  public getAccounts(): AccountClientTelegram[] {
    return this._clients;
  }

  public async sendCode(accountDto: CreateAccountDto) {
    const { apiId, apiHash, phoneNumber } = accountDto;
    const client = new TelegramClient(
      new StringSession(''),
      Number(apiId),
      apiHash,
      { connectionRetries: 5 },
    );
    await client.connect(); // Connecting to the server
    const res = await client.sendCode(
      {
        apiId: Number(apiId),
        apiHash: apiHash,
      },
      phoneNumber,
    );

    await client.disconnect();
    return { phoneCodeHash: res.phoneCodeHash };
  }

  public async createAccount(accountDto: CreateAccountDto) {
    const { apiId, apiHash, phoneNumber, code, phoneCodeHash } = accountDto;
    // console.log({ apiId, apiHash, phoneNumber, code, phoneCodeHash });
    // const tgClient = new TelegramClient(new StringSession(''), Number(apiId), apiHash, { connectionRetries: 5 });
    // await tgClient.connect();

    // await tgClient.invoke(
    //     new Api.auth.SignIn({
    //       phoneNumber,
    //       phoneCodeHash,
    //       phoneCode: code,
    //     })
    //   )
    // //await tgClient.start({phoneNumber, phoneCode: async () => code, onError: (e) => console.log(e)});

    // const session = tgClient.session.save();

    // console.log(session);

    const createdAccount =
      await this.accountsRepository.createAccount(accountDto);

    const client = new AccountClientTelegram(createdAccount);
    await client.initialyzeAsync();

    this._clients.push(client);

    return createdAccount;
  }

  public async deleteAccount(accountId: string) {
    const deletedAccount =
      await this.accountsRepository.deleteAccount(accountId);

    const client = this._clients.find((el) => el.account.id === accountId);

    if (client) {
      await client.disconnectAsync();
    }

    return deletedAccount;
  }

  public async getPaginatedAccounts(request: PaginationDto) {
    const skip = (request.page - 1) * request.limit;

    const results = await this.accountsRepository.getAllWithPagination(
      request.limit,
      skip,
    );

    return { accounts: results[0], total: results[1] };
  }

  private async _initClients() {
    const accounts = await this.accountsRepository.getAll();

    console.log(accounts);

    this._clients = accounts.map(
      (account) => new AccountClientTelegram(account),
    );

    for (const client of this._clients) {
      await client.initialyzeAsync();
    }
  }
}
