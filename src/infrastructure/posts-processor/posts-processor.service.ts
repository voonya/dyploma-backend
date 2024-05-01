import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';

import { DataAnalysService } from '../data-analys/data-analys.service';
import { Channel, Post, Reaction } from 'src/domain/models';
import { ChannelRepository } from '../repository/entities/channel';
import { PostRepository } from '../repository/entities/post';
import { PostOperationRepository } from '../repository/entities/post-operation';
import { GetPostsWithFilters } from './dto/get-posts-filters.dto';
import { ReactionRepository } from '../repository/entities/reaction';
import { TopicRepository } from '../repository/entities/topic';
import { TopicCreationRepository } from '../repository/entities/topic-creations';

@Injectable()
export class PostsProcessorService implements OnApplicationBootstrap {
    private _isProcessing = false;
    private BATCH_SIZE = 200;

    constructor(
        private readonly dataAnalysis: DataAnalysService, 
        private channelRepository: ChannelRepository, 
        private postRepository: PostRepository, 
        private postOperationRepository: PostOperationRepository,
        private reactionRepository: ReactionRepository,
        private topicRepository: TopicRepository,
        private topicCreationRepository: TopicCreationRepository

    ) {}

    async onApplicationBootstrap() {
        //this.processNewPosts(
    }

    //@Cron("*/2 * * * *")
    public async processNewPosts() {
        if(this._isProcessing) {
            console.log('Checking posts already processing...')
        }

        this._isProcessing = true;

        const postsToProcess = await this.postRepository.getNotProcessed();

        console.log(`Not processed posts ${postsToProcess.length}`)

        for(let i = 0; i < postsToProcess.length; i += this.BATCH_SIZE) {
            try {
                const startBatch = performance.now();

                console.log(i, i + this.BATCH_SIZE);
    
                const posts = postsToProcess.slice(i, i + this.BATCH_SIZE);
                // check if channel can comment / react etc (this info should be in event i think)
                // const { channel, posts } = newPosts[channelLink];
    
                console.log(`Processing ${posts.length} posts`);
    
                const isPostsPropaganda = await this.dataAnalysis.isPropaganda(posts.map((post) => post.msg));
                const postsToUpdate = posts.map((post, idx) => ({
                    ...post,
                    isPropagandaPredicted: isPostsPropaganda[idx]
                }));
    
                const updatedPosts = await this.postRepository.updateMany(postsToUpdate);
                //const savedPosts = await this.savePostsForChannel(channel, postsToSave);
    
                const propagandaPosts = updatedPosts.filter((_, idx: number) => isPostsPropaganda[idx]);
    
                const strategies = propagandaPosts.map(post => this.chooseStrategyForPost(post));
    
                await Promise.allSettled(strategies.map(strategy => strategy.execute()));
    
                const endBatch = performance.now();
                console.log(`End processing, time: ${endBatch - startBatch}`)

                await new Promise((resolve) => setTimeout(() => resolve(null), 3000));
            } catch (e) {
                console.log(e);
            }   
        }
        
        this._isProcessing = false;
    }

    public async getPaginatedPosts(request: GetPostsWithFilters) {
        const results = await this.postRepository.getAllWithPaginationAndFilters(request);

        return {posts: results[0], total: results[1]};
    }

    public async getPaginatedPostsOperations(limit: number, page: number) {
        const skip = (page - 1) * limit;

        const results = await this.postOperationRepository.getAllWithPagination(limit, skip);

        return {postsOperations: results[0], total: results[1]};
    }

    public async updatePost(post: Post) {
        return this.postRepository.update(post);
    }

    private chooseStrategyForPost(post: Post) {
        return { 
            execute: async () => {
                const channel = post.channel;
                const reactions = await this.reactionRepository.getAll();
                //check if can react
                const badReaction = this.getTheWorstReactionFromAvailable(channel.availableReactions, reactions);
                if(badReaction != null) {
                    this.sendReaction(channel, post, badReaction);
                } else {
                    console.log(`Cant find bad reaction to post ${post.idInSocial} in ${channel.link}`);
                }
                
                // TODO: check if we can comment posts
                const msgs = await this.dataAnalysis.getCommentForMessage([post.msg]);
                
                this.commentPost(channel, post, msgs[0].msg);

                await this.postRepository.update({...post, topicWords: msgs[0].topicWords, msgCleared: msgs[0].clearedText});
                await this.postOperationRepository.create({post, account: null, comment: msgs[0].msg, reaction: badReaction});
            }
        }
    }

    private getTheWorstReactionFromAvailable(availableReactions: string[], reactions: Reaction[]): string | null {
        return reactions.find(el => availableReactions.includes(el.reaction)).reaction || null;
    }

    private async commentPost(channel: Channel, post: Post, message: string) {
        console.log(`Send comment to post ${post.idInSocial} in ${channel.link}: ${message}`);
    }

    private async sendReaction(channel: Channel, post: Post, reaction: string) {
        console.log(`Send reaction to post ${post.idInSocial} in ${channel.link}: ${reaction}`);
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
