import { Module } from '@nestjs/common';

import { RepositoriesModule } from '../../dal/entities/repositories.module';
import { ChannelProcessorService } from './channel-processor.service';
import { ChannelProcessorController } from './channel-processor.controller';
import { AccountPoolModule } from '../account-pool/account-pool.module';

@Module({
  imports: [RepositoriesModule, AccountPoolModule],

  providers: [ChannelProcessorService],
  controllers: [ChannelProcessorController],

  exports: [ChannelProcessorService],
})
export class ChannelProcessorModule {}
