import { Post, Reaction } from 'src/domain/models';
import { AccountClientTelegram } from 'src/infrastructure/account-pool/account-client';
import { BaseStrategy } from './base.strategy';
import { TopicRepository } from 'src/dal/entities/topic';
import { PostOperationRepository } from 'src/dal/entities/post-operation';

export class CommentStrategy extends BaseStrategy {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly postOperationRepository: PostOperationRepository,
  ) {
    super();
  }

  async execute(
    post: Post,
    accountClients: AccountClientTelegram[],
  ): Promise<void> {
    const canComment = await accountClients[0].canComment(
      post.channel.link,
      post.idInSocial,
    );

    if (!canComment) {
      console.warn(`Cant comment post ${post.channel.link} ${post.id}`);
      return;
    }

    const topicMessages = await this.topicRepository.getMessagesForTopic(
      post.topic.id,
    );

    const selectedAccounts = this.selectAccounts(
      accountClients,
      topicMessages.length,
    );

    for (let i = 0; i < selectedAccounts.length; i++) {
      try {
        const client = selectedAccounts[i];
        await client.createComment(
          post.channel.link,
          post.idInSocial,
          topicMessages[i].message,
        );
        this.postOperationRepository.createOrUpdate({
          post,
          account: client.account,
          comment: topicMessages[i],
        });
        await new Promise((resolve) => setTimeout(() => resolve(null), 3000));
      } catch (e) {
        console.log(e);
      }
    }
    // const results = await Promise.allSettled(
    //     selectedAccounts.map(
    //         (client, idx) => client.createComment(post.channel.link, post.idInSocial, topicMessages[idx].message)
    //     )
    // );

    // results.map((result, idx) => {
    //     if(result.status == 'fulfilled') {
    //         const client = selectedAccounts[idx];
    //         this.postOperationRepository.createOrUpdate({post, account: client.account, comment: topicMessages[idx]});
    //         return;
    //     }

    //     console.log(`Failed to comment to post: ${result.reason}`);
    // })
  }

  private selectAccounts(accounts: AccountClientTelegram[], count: number) {
    return accounts
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .filter((el) => el);
  }

  private getTheWorstReactionFromAvailable(
    availableReactions: string[],
    reactions: Reaction[],
  ): string | null {
    return (
      reactions.find((el) => availableReactions.includes(el.reaction))
        .reaction || null
    );
  }
}
