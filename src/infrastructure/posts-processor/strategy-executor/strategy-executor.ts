import { Injectable } from '@nestjs/common';
import { Post } from 'src/domain/models';
import { BaseStrategy } from './strategies/base.strategy';
import { ReactionStrategy } from './strategies/reaction.strategy';
import { CommentStrategy } from './strategies/comment.strategy';
import { ReactionRepository } from 'src/dal/entities/reaction';
import { PostOperationRepository } from 'src/dal/entities/post-operation';
import { TopicRepository } from 'src/dal/entities/topic';
import { AccountPoolService } from 'src/infrastructure/account-pool/account-pool.service';

@Injectable()
export class StrategyExecutor {
  private readonly _strategies: BaseStrategy[];

  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly reactionRepository: ReactionRepository,
    private readonly postOperationRepository: PostOperationRepository,
    private readonly accountsPool: AccountPoolService,
  ) {
    this._strategies = [
      new ReactionStrategy(reactionRepository, postOperationRepository),
      new CommentStrategy(topicRepository, postOperationRepository),
    ];
  }

  public async processPosts(posts: Post[]) {
    const accountClients = this.accountsPool.getAccounts();

    for (const post of posts) {
      for (const strategy of this._strategies) {
        await strategy.execute(post, accountClients);
      }
    }
  }
}
