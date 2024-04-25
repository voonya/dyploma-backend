import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression  } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';


import { TelegramService } from '../telegram/telegram.service';
import { ChannelRepository } from '../repository/entities/channel';
import { Channel, Post } from 'src/domain/models';
import { PostRepository } from '../repository/entities/post';

@Injectable()
export class PostsCheckerService implements OnApplicationBootstrap {
    private _isProcessing = false;

    constructor(public readonly telegramService: TelegramService, private eventEmitter: EventEmitter2, private channelRepository: ChannelRepository) {}

    public async onApplicationBootstrap() {
       //await this.checkChannelsForNewPosts();
       //await this.telegramService.joinChannel('https://t.me/odessa_infonews');
    }

    @Cron("*/5 * * * *")
    private async checkChannelsForNewPosts() {
        if(this._isProcessing) {
            console.log('Checking posts already processing...')
        }

        this._isProcessing = true;
        const channels = (await this.getChannelsForCheck());

        const result: Record<string, any> = {};
        let countNewPosts = 0;

        for(const channel of channels) {
            console.log(`Checking posts for ${channel.title}`);
            let minId = channel.lastPostIdInSocial == null ? undefined : Number(channel.lastPostIdInSocial) + 1;
            let limit;

            if(!minId) {
                limit = 20;
            }

            const posts = (await this.telegramService.getPosts(channel.link, minId, limit)).filter((el: any) => el.msg != '');

            
            countNewPosts += posts.length;
            result[channel.link] = { channel, posts };

            await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
        }

        console.log(`Finish checking posts: ${countNewPosts} new posts`);

        this.eventEmitter.emit('new-posts', result);
        this._isProcessing = false;
    }


    private async getChannelsForCheck() {
        return this.channelRepository.getAll();
    }
}
