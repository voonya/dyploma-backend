import { Post } from 'src/domain/models';
import { AccountClientTelegram } from 'src/infrastructure/account-pool/account-client';

export abstract class BaseStrategy {
  abstract execute(
    post: Post,
    accountClients: AccountClientTelegram[],
  ): Promise<void>;
}
