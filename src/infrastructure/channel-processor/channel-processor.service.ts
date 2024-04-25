import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataAnalysService } from '../data-analys/data-analys.service';
import { ChannelRepository } from '../repository/entities/channel';
import { Channel } from 'src/domain/models';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class ChannelProcessorService {
    constructor(private readonly channelRepository: ChannelRepository, private readonly telegramService: TelegramService) {}

    public async addChannel(link: string, accountIds: string[]) {
        const channel = await this.channelRepository.getByLink(link);

        if(channel != null) {
            throw new Error(`Channel ${link} already added!`);
        }

        // fetch full channel;
        const tgChannel = await this.telegramService.getFullChannel(link);

        // create channel
        const createdChannel = await this.channelRepository.create(tgChannel);

        if(accountIds.length > 0) {
            await this.attachAcountToChannel(createdChannel.id, accountIds);
        }

        return createdChannel;
    }

    public async attachAcountToChannel(channelId: string, accountIds: string[]) {
        // TODO: implement
    }
}
