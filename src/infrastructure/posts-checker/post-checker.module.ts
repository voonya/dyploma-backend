import { Module } from '@nestjs/common';

import { PostsCheckerService } from './post-checker.service';
import { RepositoriesModule } from '../../dal/entities/repositories.module';
import { AccountPoolModule } from '../account-pool/account-pool.module';

@Module({
  imports: [RepositoriesModule, AccountPoolModule],
  providers: [PostsCheckerService],
  exports: [PostsCheckerService],
})
export class PostsCheckerModule {}
