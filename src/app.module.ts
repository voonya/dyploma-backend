import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataAnalysModule, PostsCheckerModule, PostsProcessorModule, TelegramModule } from './infrastructure';
import { ChannelProcessorModule } from './infrastructure/channel-processor/channel-processor.module';
import { ReactionsModule } from './infrastructure';
import { TopicsModule } from './infrastructure/topics/topics.module';
@Module({
  imports: [
    TelegramModule, 
    DataAnalysModule, 
    PostsCheckerModule, 
    PostsProcessorModule, 
    ChannelProcessorModule, 
    ReactionsModule, 
    TopicsModule,
    ScheduleModule.forRoot(), 
    EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
