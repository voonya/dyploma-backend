import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { Reaction } from 'src/domain/models';

export class ReactionRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async getAll(): Promise<Reaction[]> {
    return this.prisma.reaction.findMany({
      orderBy: {
        rank: 'desc',
      },
    });
  }

  async getAllWithPagination(
    limit: number,
    offset: number,
  ): Promise<[Reaction[], number]> {
    const [channels, totalCount] = await Promise.all([
      this.prisma.reaction.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          rank: 'desc',
        },
      }),
      this.prisma.reaction.count(),
    ]);

    return [channels, totalCount];
  }

  create(data: Reaction): Promise<Reaction> {
    return this.prisma.reaction.create({
      data,
    });
  }

  update(data: Reaction): Promise<Reaction> {
    return this.prisma.reaction.update({
      where: { id: data.id },
      data,
    });
  }

  delete(id: string): Promise<Reaction> {
    return this.prisma.reaction.delete({
      where: { id },
    });
  }
}
