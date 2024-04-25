import { Module } from '@nestjs/common';

import { RepositoriesModule } from '../repository/entities/repositories.module';
import { ChannelProcessorService } from './channel-processor.service';
import { ChannelProcessorController } from './channel-processor.controller';
import { TelegramModule } from '../telegram/telegram.module';


@Module({
  imports: [RepositoriesModule, TelegramModule],

  providers: [ChannelProcessorService],
  controllers: [ChannelProcessorController],

  exports: [ChannelProcessorService]
})
export class ChannelProcessorModule {}
