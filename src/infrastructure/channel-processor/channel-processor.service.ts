import { Injectable } from '@nestjs/common';

import { ChannelRepository } from '../../dal/entities/channel';
import { AccountPoolService } from '../account-pool/account-pool.service';

@Injectable()
export class ChannelProcessorService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly accountsPool: AccountPoolService,
  ) {}

  public async addChannel(link: string) {
    const client = this.accountsPool.getAccounts()[0];
    const channel = await this.channelRepository.getByLink(link);

    if (channel != null) {
      throw new Error(`Channel ${link} already added!`);
    }

    const tgChannel = await client.getFullChannel(link);

    const createdChannel = await this.channelRepository.create(tgChannel);

    return createdChannel;
  }

  public async getPaginatedChannels(limit: number, page: number) {
    const skip = (page - 1) * limit;

    const results = await this.channelRepository.getAllWithPagination(
      limit,
      skip,
    );

    return { channels: results[0], total: results[1] };
  }

  public deleteChannel(id: string) {
    return this.channelRepository.delete(id);
  }
}
