import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ChannelRepository } from '../../dal/entities/channel';
import { Channel, Post } from 'src/domain/models';
import { PostRepository } from '../../dal/entities/post';
import { AccountPoolService } from '../account-pool/account-pool.service';

@Injectable()
export class PostsCheckerService implements OnApplicationBootstrap {
  private _isProcessing = false;

  constructor(
    private channelRepository: ChannelRepository,
    private postRepository: PostRepository,
    private accountsPool: AccountPoolService,
  ) {}

  public async onApplicationBootstrap() {
    //await this.checkChannelsForNewPosts();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async checkChannelsForNewPosts() {
    if (this._isProcessing) {
      console.log('Checking posts already processing...');
    }

    const client = this.accountsPool.getAccounts()[0];

    this._isProcessing = true;

    const channelsAll = await this.getChannelsForCheck();
    const channels = channelsAll.filter(
      (el) => el.link === 'https://t.me/dyploma_ts',
    );

    const result: Record<string, any> = {};
    let countNewPosts = 0;

    for (const channel of channels) {
      console.log(`Checking posts for ${channel.title}`);

      const minId =
        channel.lastPostIdInSocial == null
          ? undefined
          : Number(channel.lastPostIdInSocial);
      let limit;

      if (!minId) {
        limit = 200;
      }
      console.log(minId, limit);
      const posts = (await client.getPosts(channel.link, minId, limit)).filter(
        (el: any) => el.msg != '' && !!el.msg,
      );

      await this.savePostsForChannel(channel, posts);
      countNewPosts += posts.length;
      result[channel.link] = { channel, posts };

      await new Promise((resolve) => setTimeout(() => resolve(null), 3000));
    }

    console.log(`Finish checking posts: ${countNewPosts} new posts`);

    //this.eventEmitter.emit('new-posts', result);
    this._isProcessing = false;
  }

  private async getChannelsForCheck() {
    return this.channelRepository.getAll();
  }

  private async savePostsForChannel(
    channel: Channel,
    posts: Post[],
  ): Promise<Post[]> {
    if (posts.length > 0) {
      channel.lastPostIdInSocial = String(posts[0].idInSocial);
      await this.channelRepository.update(channel);

      return await this.postRepository.createMany(
        posts.map((el) => ({ ...el, channel: channel })),
      );
    }

    return [];
  }
}
