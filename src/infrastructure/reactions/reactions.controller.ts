import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { ReactionsService } from './reactions.service';
import { Reaction } from 'src/domain/models';
import { PaginationDto } from 'src/domain/dto/pagination.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  create(@Body() data: CreateReactionDto): Promise<Reaction> {
    return this.reactionsService.createReaction(data);
  }

  @Get()
  async getReactions(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const data = await this.reactionsService.getPaginated(limit, page);

    return {data};
  }
}