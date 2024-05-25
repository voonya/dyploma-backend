import { Module } from '@nestjs/common';

import { AccountPoolService } from './account-pool.service';
import { RepositoriesModule } from '../../dal/entities/repositories.module';
import { AccountsController } from './account.controller';

@Module({
  imports: [RepositoriesModule],
  providers: [AccountPoolService],
  controllers: [AccountsController],
  exports: [AccountPoolService],
})
export class AccountPoolModule {}
