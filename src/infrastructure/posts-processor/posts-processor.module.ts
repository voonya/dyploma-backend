import { Module } from '@nestjs/common';

import { PostsProcessorService } from './posts-processor.service';
import { DataAnalysModule } from '../data-analys/data-analys.module';
import { RepositoriesModule } from '../repository/entities/repositories.module';
import { PostProcessorController } from './post-processor.controller';

@Module({
  imports: [DataAnalysModule, RepositoriesModule],
  controllers: [PostProcessorController],
  providers: [PostsProcessorService],
  exports: [PostsProcessorService]
})
export class PostsProcessorModule {}
