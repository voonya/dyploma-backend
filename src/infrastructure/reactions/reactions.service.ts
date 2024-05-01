import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataAnalysService } from '../data-analys/data-analys.service';
import { ChannelRepository } from '../repository/entities/channel';
import { Channel } from 'src/domain/models';
import { TelegramService } from '../telegram/telegram.service';
import { ReactionRepository } from '../repository/entities/reaction';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
    constructor(private readonly reactionRepository: ReactionRepository) {}

    public async getPaginated(limit: number, page: number) {
        const skip = (page - 1) * limit;

        const results = await this.reactionRepository.getAllWithPagination(limit, skip);

        return {reactions: results[0], total: results[1]};
    }

    public async getAll() {
        return this.reactionRepository.getAll();
    }

    public async createReaction(data: CreateReactionDto) {
        return this.reactionRepository.create(data);
    }
}
