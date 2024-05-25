import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from '@nestjs/common';

import { ChannelProcessorService } from './channel-processor.service';
import { CreateChannelDto } from './dto';
import { Channel } from 'src/domain/models';
import { PaginationDto } from 'src/domain/dto/pagination.dto';

@Controller('channel')
export class ChannelProcessorController {
  constructor(private readonly channelProcessor: ChannelProcessorService) {}

  @Post()
  createChannel(@Body() data: CreateChannelDto): Promise<Channel> {
    return this.channelProcessor.addChannel(data.link);
  }

  @Get()
  async getChannels(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const data = await this.channelProcessor.getPaginatedChannels(limit, page);
    return { data };
  }

  @Delete(':id')
  async deleteChannel(@Param('id') id: string) {
    const data = await this.channelProcessor.deleteChannel(id);

    return { data };
  }
}
