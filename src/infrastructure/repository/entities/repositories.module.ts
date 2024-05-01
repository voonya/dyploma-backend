import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { ChannelRepository } from './channel';
import { CanOperateRepository } from './can-operate';
import { PostRepository } from './post';
import { PostOperationRepository } from './post-operation';
import { ReactionRepository } from './reaction';
import { TopicRepository } from './topic';
import { TopicCreationRepository } from './topic-creations';


@Module({
  providers: [
    PrismaService,
    ChannelRepository,
    CanOperateRepository,
    PostRepository,
    PostOperationRepository,
    ReactionRepository,
    TopicRepository,
    TopicCreationRepository,
  ],
  exports: [
    PrismaService,
    ChannelRepository,
    CanOperateRepository,
    PostRepository,
    PostOperationRepository,
    ReactionRepository,
    TopicRepository,
    TopicCreationRepository,
  ],
})
export class RepositoriesModule {}
