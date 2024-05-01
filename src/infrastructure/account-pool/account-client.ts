import { Injectable, OnModuleInit } from '@nestjs/common';
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

  private async _initClient() {
    this._client = new TelegramClient(this.account.session, this.account.apiId, this.account.apiHash, {
      connectionRetries: 5,
    });

    await this._client.connect();
  }  

  public async getChannels(): Promise<any> {
    let dialogs = await this._client.getDialogs();

    return dialogs
      .filter(dialog => dialog.entity?.className === 'Channel')
      .map(dialog => ({ id: dialog.id?.toString(), title: (dialog.entity as any).title }));
  }

  public async getFullChannel(channelLink: string): Promise<Channel> {
    const result = await this._client.invoke(
      new Api.channels.GetFullChannel({ channel: channelLink })
    );

    return {
      link: channelLink,
      idInSocial: "-" + result.fullChat.id as any,
      title: (result.chats[0] as any).title,
      description: result.fullChat.about,
      availableReactions: (result.fullChat.availableReactions as any)?.reactions?.map((el: any) => el.emoticon).filter((el: any) => !!el) || [],
      lastPostIdInSocial: null
    };
    
  }

  public async getPosts(channelId: string, minId?: number, limit?: number) {
    const posts = await this._client.invoke(
      new Api.messages.GetHistory({
        peer: channelId,
        addOffset: 0,
        limit,
        minId
      })
    ) as any;
  
    return posts.messages.map((post: any) => ({
      idInSocial: String(post.id),
      msg: post.message,
      socialCreationDate: new Date(post.date * 1000)
      // reactions: post.reactions?.results?.map((result: any) => ({
      //   reaction: result.reaction,
      //   count: result.count,
      // })),
      // views: post.views,
      // forwards: post.forwards,
      // replies: post.replies?.replies,
    }));
  }

  public async createComment(channelId: string, postId: string, comment: string): Promise<any> {
    const discussionMessage = await this._client.invoke(
      new Api.messages.GetDiscussionMessage({
        peer: channelId,
        msgId: Number(postId),
      })
    );

    const result = await this._client.sendMessage(discussionMessage.chats[0].id, {
        commentTo: discussionMessage.messages[0].id,
        message: comment,
    });

    return result;
  }

  public async sendReactionToPost(channelId: string, postId: string, reaction: string): Promise<any> {
    const result = await this._client.invoke(
      new Api.messages.SendReaction({
        peer: channelId,
        msgId: Number(postId),
        reaction: [new Api.ReactionEmoji({ emoticon: reaction })],
      })
    );
  
    return result;
  }

  public async removeReactionsFromPost(channelId: string, postId: string): Promise<any> {
    const result = await this._client.invoke(
      new Api.messages.SendReaction({
        peer: channelId,
        msgId: Number(postId),
        reaction: [], 
      })
    );
  
    return result;
  }

  public async joinChannel(link: string): Promise<boolean> {
    const result = await this._client.invoke(
      new Api.channels.JoinChannel({
        channel: link,
      })
    );

    return true;
  }
}
