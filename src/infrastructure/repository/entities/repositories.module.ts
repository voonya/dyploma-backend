import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { ChannelRepository } from './channel';
import { CanOperateRepository } from './can-operate';
import { PostRepository } from './post';
import { PostOperationRepository } from './post-operation';


@Module({
  providers: [
    PrismaService,
    ChannelRepository,
    CanOperateRepository,
    PostRepository,
    PostOperationRepository,
  ],
  exports: [
    PrismaService,
    ChannelRepository,
    CanOperateRepository,
    PostRepository,
    PostOperationRepository,
  ],
})
export class RepositoriesModule {}
