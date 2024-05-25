import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { DataAnalysService } from '../data-analys/data-analys.service';
import { Post } from 'src/domain/models';
import { PostRepository } from '../../dal/entities/post';
import { PostOperationRepository } from '../../dal/entities/post-operation';
import { GetPostsWithFilters } from './dto/get-posts-filters.dto';
import { StrategyExecutor } from './strategy-executor/strategy-executor';

@Injectable()
export class PostsProcessorService implements OnApplicationBootstrap {
  private _isProcessing = false;
  private BATCH_SIZE = 200;

  constructor(
    private readonly dataAnalysis: DataAnalysService,
    private postRepository: PostRepository,
    private postOperationRepository: PostOperationRepository,
    private strategyExecutor: StrategyExecutor,
  ) {}

  async onApplicationBootstrap() {
    //setTimeout(() => this.processNewPosts(), 2000);
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async processNewPosts() {
    if (this._isProcessing) {
      console.log('Checking posts already processing...');
    }

    this._isProcessing = true;

    const postsToProcess = await this.postRepository.getNotProcessed();

    console.log(`Not processed posts ${postsToProcess.length}`);

    for (let i = 0; i < postsToProcess.length; i += this.BATCH_SIZE) {
      try {
        const startBatch = performance.now();

        console.log(i, i + this.BATCH_SIZE);

        const posts = postsToProcess.slice(i, i + this.BATCH_SIZE);

        console.log(`Processing ${posts.length} posts`);

        const isPostsPropaganda = await this.dataAnalysis.isPropaganda(
          posts.map((post) => post.msg),
        );
        let postsToUpdate: any[] = posts.map((post, idx) => ({
          ...post,
          isPropagandaPredicted: isPostsPropaganda[idx],
        }));

        let updatedPosts = await this.postRepository.updateMany(postsToUpdate);
        //const savedPosts = await this.savePostsForChannel(channel, postsToSave);

        const propagandaPosts = updatedPosts.filter(
          (_, idx: number) => isPostsPropaganda[idx],
        );

        const postsTopic = await this.dataAnalysis.getTopics(
          propagandaPosts.map((post) => post.msg),
        );

        postsToUpdate = propagandaPosts.map((post, idx) => ({
          ...post,
          topic: {
            id: postsTopic[idx].topicId,
          },
        }));

        updatedPosts = await this.postRepository.updateMany(postsToUpdate);
        await this.strategyExecutor.processPosts(updatedPosts);

        const endBatch = performance.now();
        console.log(`End processing, time: ${endBatch - startBatch}`);

        await new Promise((resolve) => setTimeout(() => resolve(null), 3000));
      } catch (e) {
        console.log(e);
      }
    }

    this._isProcessing = false;
  }

  public async getPaginatedPosts(request: GetPostsWithFilters) {
    const results =
      await this.postRepository.getAllWithPaginationAndFilters(request);

    return { posts: results[0], total: results[1] };
  }

  public async getPostsStats() {
    return this.postRepository.getStats();
  }

  public async getPaginatedPostsOperations(limit: number, page: number) {
    const skip = (page - 1) * limit;

    const results = await this.postOperationRepository.getAllWithPagination(
      limit,
      skip,
    );

    return { postsOperations: results[0], total: results[1] };
  }

  public async updatePost(post: Post) {
    return this.postRepository.update(post);
  }
}
