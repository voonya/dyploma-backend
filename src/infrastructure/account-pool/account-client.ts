import { Injectable } from '@nestjs/common';

import { Account, Channel } from 'src/domain/models';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';

@Injectable()
export class AccountClientTelegram {
  private _client: TelegramClient;

  constructor(public readonly account: Account) {}

  async initialyzeAsync() {
    await this._initClient();
  }

  public async disconnectAsync() {
    await this._client.disconnect();
  }

  private async _initClient() {
    const stringSession = new StringSession(this.account.session);
    this._client = new TelegramClient(
      stringSession,
      this.account.apiId,
      this.account.apiHash,
      {
        connectionRetries: 5,
      },
    );

    this._client.connect();
  }

  public async getChannels(): Promise<any> {
    const dialogs = await this._client.getDialogs();

    return dialogs
      .filter((dialog) => dialog.entity?.className === 'Channel')
      .map((dialog) => ({
        id: dialog.id?.toString(),
        title: (dialog.entity as any).title,
      }));
  }

  public async getFullChannel(channelLink: string): Promise<Channel> {
    const result = await this._client.invoke(
      new Api.channels.GetFullChannel({ channel: channelLink }),
    );

    return {
      link: channelLink,
      idInSocial: ('-' + result.fullChat.id) as any,
      title: (result.chats[0] as any).title,
      description: result.fullChat.about,
      availableReactions:
        (result.fullChat.availableReactions as any)?.reactions
          ?.map((el: any) => el.emoticon)
          .filter((el: any) => !!el) || [],
      lastPostIdInSocial: null,
    };
  }

  public async getPosts(channelId: string, minId?: number, limit?: number) {
    const posts = (await this._client.invoke(
      new Api.messages.GetHistory({
        peer: channelId,
        addOffset: 0,
        limit,
        minId,
      }),
    )) as any;

    return posts.messages.map((post: any) => ({
      idInSocial: String(post.id),
      msg: post.message,
      socialCreationDate: new Date(post.date * 1000),
      // reactions: post.reactions?.results?.map((result: any) => ({
      //   reaction: result.reaction,
      //   count: result.count,
      // })),
      // views: post.views,
      // forwards: post.forwards,
      // replies: post.replies?.replies,
    }));
  }

  public async createComment(
    channelId: string,
    postId: string,
    comment: string,
  ): Promise<any> {
    console.log(`Send comment to post ${postId} in ${channelId}: ${comment}`);
    //await new Promise((resolve) => setTimeout(() => resolve(null), 100));
    if (channelId != 'https://t.me/dyploma_ts') return;
    const discussionMessage = await this._client.invoke(
      new Api.messages.GetDiscussionMessage({
        peer: channelId,
        msgId: Number(postId),
      }),
    );

    const result = await this._client.sendMessage(
      discussionMessage.chats[0].id,
      {
        commentTo: discussionMessage.messages[0].id,
        message: comment,
      },
    );

    return result;
  }

  public async sendReactionToPost(
    channelId: string,
    postId: string,
    reaction: string,
  ): Promise<any> {
    console.log(`Send reaction to post ${postId} in ${channelId}: ${reaction}`);
    //await new Promise((resolve) => setTimeout(() => resolve(null), 100));
    console.log(channelId, postId, reaction);
    if (channelId != 'https://t.me/dyploma_ts') return;

    const result = await this._client.invoke(
      new Api.messages.SendReaction({
        peer: channelId,
        msgId: Number(postId),
        reaction: [new Api.ReactionEmoji({ emoticon: reaction })],
      }),
    );

    return result;
  }

  public async canComment(channelId: string, postId: string) {
    try {
      console.log(channelId.replace('-', '-100'));
      await this._client.invoke(
        new Api.messages.GetDiscussionMessage({
          peer: channelId.replace('-', '-100'),
          msgId: Number(postId),
        }),
      );

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  }

  public async removeReactionsFromPost(
    channelId: string,
    postId: string,
  ): Promise<any> {
    const result = await this._client.invoke(
      new Api.messages.SendReaction({
        peer: channelId,
        msgId: Number(postId),
        reaction: [],
      }),
    );

    return result;
  }

  public async joinChannel(link: string): Promise<boolean> {
    const result = await this._client.invoke(
      new Api.channels.JoinChannel({
        channel: link,
      }),
    );

    return true;
  }
}
