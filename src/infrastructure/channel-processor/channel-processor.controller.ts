import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { ChannelProcessorService } from './channel-processor.service';
import { CreateChannelDto } from './dto';
import { Channel } from 'src/domain/models';
import { PaginationDto } from 'src/domain/dto/pagination.dto';

@Controller('channel')
export class ChannelProcessorController {
  constructor(private readonly channelProcessor: ChannelProcessorService) {}

  @Post()
  createChannel(@Body() data: CreateChannelDto): Promise<Channel> {
    return this.channelProcessor.addChannel(data.link, data.accountIds);
  }

  @Get()
  async getChannels(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const data = await this.channelProcessor.getPaginatedChannels(limit, page);
    return {data};
  }
}