import { Module } from '@nestjs/common';

import { AccountPoolService } from './account-pool.service';
import { RepositoriesModule } from '../repository/entities/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [AccountPoolService],
  exports: [AccountPoolService]
})
export class AccountPoolModule {}
