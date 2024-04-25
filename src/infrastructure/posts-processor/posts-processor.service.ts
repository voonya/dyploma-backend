import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { DataAnalysService } from '../data-analys/data-analys.service';
import { Channel, Post } from 'src/domain/models';
import { ChannelRepository } from '../repository/entities/channel';
import { PostRepository } from '../repository/entities/post';
import { PostOperationRepository } from '../repository/entities/post-operation';

@Injectable()
export class PostsProcessorService {
    private _isProcessing = false;

    constructor(private readonly dataAnalysis: DataAnalysService, private channelRepository: ChannelRepository, private postRepository: PostRepository, private postOperationRepository: PostOperationRepository) {}

    @OnEvent('new-posts')
    public async processNewPosts(newPosts: Record<string, {channel: Channel, posts: Post[]}>) {
        if(this._isProcessing) {
            console.log('Checking posts already processing...')
        }

        this._isProcessing = true;

        for(const channelLink in newPosts) {
            const startChannel = performance.now();
            // check if channel can comment / react etc (this info should be in event i think)
            const { channel, posts } = newPosts[channelLink];

            console.log(`Processing ${posts.length} posts for ${channelLink}`);

            const isPostsPropaganda = await this.dataAnalysis.isPropaganda(posts.map((post) => post.msg));
            const postsToSave = posts.map((post, idx) => ({
                ...post,
                isPropagandaPredicted: isPostsPropaganda[idx]
            }));

            const savedPosts = await this.savePostsForChannel(channel, postsToSave);

            const propagandaPosts = savedPosts.filter((_, idx: number) => isPostsPropaganda[idx]);

            const strategies = propagandaPosts.map(post => this.chooseStrategyForPost(channel, post));

            await Promise.allSettled(strategies.map(strategy => strategy.execute()));

            const endChannel = performance.now();
            console.log(`End processing, time: ${endChannel - startChannel}`)
        }
        
        this._isProcessing = false;
    }

    private chooseStrategyForPost(channel: Channel, post: Post) {
        return { 
            execute: async () => {
                //check if can react
                const badReaction = this.getTheWorstReactionFromAvailable(channel.availableReactions);
                if(badReaction != null) {
                    this.sendReaction(channel, post, badReaction);
                } else {
                    console.log(`Cant find bad reaction to post ${post.idInSocial} in ${channel.link}`);
                }
                
                // check if we can comment posts
                const msgs = await this.dataAnalysis.getCommentForMessage([post.msg]);
                this.commentPost(channel, post, msgs[0]);

                this.postOperationRepository.create({post, account: null, comment: msgs[0], reaction: badReaction});
            }
        }
    }

    private getTheWorstReactionFromAvailable(availableReactions: string[]): string | null {
        const worstReactions: Record<string, number> = {
            '👎': 10,
            '😢': 9,
            '👍': 8, // temporary
        }

        let highestScore = -Infinity;
        let reactionWithHighestScore = null;

        availableReactions.forEach(reaction => {
            if (worstReactions[reaction] !== undefined && worstReactions[reaction] > highestScore) {
                highestScore = worstReactions[reaction];
                reactionWithHighestScore = reaction;
            }
        });

        return reactionWithHighestScore;
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
