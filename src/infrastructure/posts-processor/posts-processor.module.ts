import { Module } from '@nestjs/common';

import { PostsProcessorService } from './posts-processor.service';
import { DataAnalysModule } from '../data-analys/data-analys.module';
import { RepositoriesModule } from '../../dal/entities/repositories.module';
import { PostProcessorController } from './post-processor.controller';
import { AccountPoolModule } from '../account-pool/account-pool.module';
import { StrategyExecutor } from './strategy-executor/strategy-executor';

@Module({
  imports: [DataAnalysModule, RepositoriesModule, AccountPoolModule],
  controllers: [PostProcessorController],
  providers: [PostsProcessorService, StrategyExecutor],
  exports: [PostsProcessorService],
})
export class PostsProcessorModule {}
