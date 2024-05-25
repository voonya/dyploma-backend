import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import {
  DataAnalysModule,
  PostsCheckerModule,
  PostsProcessorModule,
} from './infrastructure';
import { ChannelProcessorModule } from './infrastructure/channel-processor/channel-processor.module';
import { ReactionsModule } from './infrastructure';
import { TopicsModule } from './infrastructure/topics/topics.module';
import { AuthModule } from './infrastructure/auth/auth.module';
@Module({
  imports: [
    DataAnalysModule,
    PostsCheckerModule,
    PostsProcessorModule,
    ChannelProcessorModule,
    ReactionsModule,
    TopicsModule,
    AuthModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
