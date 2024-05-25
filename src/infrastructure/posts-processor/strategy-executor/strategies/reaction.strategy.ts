import { Post, Reaction } from 'src/domain/models';
import { AccountClientTelegram } from 'src/infrastructure/account-pool/account-client';
import { BaseStrategy } from './base.strategy';
import { ReactionRepository } from 'src/dal/entities/reaction';
import { PostOperationRepository } from 'src/dal/entities/post-operation';

export class ReactionStrategy extends BaseStrategy {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    private readonly postOperationRepository: PostOperationRepository,
  ) {
    super();
  }

  async execute(
    post: Post,
    accountClients: AccountClientTelegram[],
  ): Promise<void> {
    const reactions = await this.reactionRepository.getAll();

    const reaction = this.getTheWorstReactionFromAvailable(
      post.channel.availableReactions,
      reactions,
    );
    console.log(reactions, reaction, post.channel.availableReactions);
    if (reaction == null) return;

    for (const client of accountClients) {
      try {
        await client.sendReactionToPost(
          post.channel.link,
          post.idInSocial,
          reaction.reaction,
        );
        this.postOperationRepository.createOrUpdate({
          post,
          account: client.account,
          reaction,
        });
        await new Promise((resolve) => setTimeout(() => resolve(null), 3000));
      } catch (e) {
        console.log(e);
      }
    }
    // const results = await Promise.allSettled(
    //     accountClients.map(
    //         client => client.sendReactionToPost(post.channel.link, post.idInSocial, reaction.reaction)
    //     )
    // );

    // results.map((result, idx) => {
    //     if(result.status == 'fulfilled') {
    //         const client = accountClients[idx];
    //         this.postOperationRepository.createOrUpdate({post, account: client.account, reaction});
    //         return;
    //     }

    //     console.log(`Failed to react to post: ${result.reason}`);
    // })
  }

  private getTheWorstReactionFromAvailable(
    availableReactions: string[],
    reactions: Reaction[],
  ): Reaction | null {
    return (
      reactions.find((el) => availableReactions.includes(el.reaction)) || null
    );
  }
}
