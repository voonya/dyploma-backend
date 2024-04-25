import { Controller, Get, Post, Body } from '@nestjs/common';

import { ChannelProcessorService } from './channel-processor.service';
import { CreateChannelDto } from './dto';
import { Channel } from 'src/domain/models';

@Controller()
export class ChannelProcessorController {
  constructor(private readonly channelProcessor: ChannelProcessorService) {}

  @Post('/channel')
  createChannel(@Body() data: CreateChannelDto): Promise<Channel> {
    return this.channelProcessor.addChannel(data.link, data.accountIds);
  }
}