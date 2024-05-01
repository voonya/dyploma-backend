import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { TopicsService } from './topics.service';
import { Channel } from 'src/domain/models';
import { CreateTopicMessageDto } from './dto/create-topic-message.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsProcessor: TopicsService) {}

  @Post(':id/messages')
  async createTopicMessage(@Param('id') id: string, @Body() message: CreateTopicMessageDto) {
    const result = await this.topicsProcessor.addTopicMessage(message, id);

    return { data: result }
  }

  
  @Post(':id/messages/:messageId')
  async updateTopicMessage(@Param('messageId') messageId: string, @Body() message: CreateTopicMessageDto) {
    const result = await this.topicsProcessor.updateTopicMessage({...message, id: messageId});

    return { data: result }
  }

  @Delete(':id/messages/:messageId')
  async deleteTopicMessage(@Param('messageId') messageId: string) {
    const result = await this.topicsProcessor.deleteTopicMessage(messageId);

    return { data: result }
  }

  @Get()
  async getTopics() {
    const data = await this.topicsProcessor.getTopics();

    return { data };
  }
}