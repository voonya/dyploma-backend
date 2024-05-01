import { Module } from '@nestjs/common';

import { RepositoriesModule } from '../repository/entities/repositories.module';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';


@Module({
  imports: [RepositoriesModule],

  providers: [TopicsService],
  controllers: [TopicsController],

  exports: [TopicsService]
})
export class TopicsModule {}
