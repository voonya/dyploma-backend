import { Injectable } from '@nestjs/common';
import { Reaction } from 'src/domain/models';

import { ReactionRepository } from '../../dal/entities/reaction';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(private readonly reactionRepository: ReactionRepository) {}

  public async getPaginated(limit: number, page: number) {
    const skip = (page - 1) * limit;

    const results = await this.reactionRepository.getAllWithPagination(
      limit,
      skip,
    );

    return { reactions: results[0], total: results[1] };
  }

  public async getAll() {
    return this.reactionRepository.getAll();
  }

  public async createReaction(data: CreateReactionDto) {
    return this.reactionRepository.create(data);
  }

  public async updateReaction(data: Reaction) {
    return this.reactionRepository.update(data);
  }

  public async deleteReaction(id: string) {
    return this.reactionRepository.delete(id);
  }
}
