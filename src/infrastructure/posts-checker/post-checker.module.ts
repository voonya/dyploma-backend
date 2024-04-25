import { Module } from '@nestjs/common';

import { TelegramModule } from '../telegram/telegram.module';
import { PostsCheckerService } from './post-checker.service';
import { RepositoriesModule } from '../repository/entities/repositories.module';

@Module({
  imports: [TelegramModule, RepositoriesModule],
  providers: [PostsCheckerService],
  exports: [PostsCheckerService]
})
export class PostsCheckerModule {}
