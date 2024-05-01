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

    constructor(public readonly telegramService: TelegramService, private eventEmitter: EventEmitter2, private channelRepository: ChannelRepository, private postRepository: PostRepository) {}

    public async onApplicationBootstrap() {
       //await this.checkChannelsForNewPosts();
       //await this.telegramService.joinChannel('https://t.me/odessa_infonews');
    }

    //@Cron("*/1 * * * *")
    private async checkChannelsForNewPosts() {
        if(this._isProcessing) {
            console.log('Checking posts already processing...')
        }

        this._isProcessing = true;
        const channels = (await this.getChannelsForCheck()).slice(0, 1);

        const result: Record<string, any> = {};
        let countNewPosts = 0;

        for(const channel of channels) {
            console.log(`Checking posts for ${channel.title}`);
            let minId = channel.lastPostIdInSocial == null ? undefined : Number(channel.lastPostIdInSocial) + 1;
            let limit;

            if(!minId) {
                limit = 150;
            }

            const posts = (await this.telegramService.getPosts(channel.link, minId, limit)).filter((el: any) => el.msg != '' && !!el.msg).slice(0, 1);

            await this.savePostsForChannel(channel, posts);
            countNewPosts += posts.length;
            result[channel.link] = { channel, posts };

            await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
        }

        console.log(`Finish checking posts: ${countNewPosts} new posts`);

        //this.eventEmitter.emit('new-posts', result);
        this._isProcessing = false;
    }


    private async getChannelsForCheck() {
        return this.channelRepository.getAll();
    }

    private async savePostsForChannel(channel: Channel, posts: Post[]): Promise<Post[]> {
        if(posts.length > 0) {
            channel.lastPostIdInSocial = String(posts[0].idInSocial);
            await this.channelRepository.update(channel);

            return await this.postRepository.createMany(posts.map(el => ({...el, channel: channel})));
        }

        return [];
    } 
}
