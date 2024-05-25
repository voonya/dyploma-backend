import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { TopicCreation } from 'src/domain/models';

class TopicCreationRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  create(): Promise<TopicCreation> {
    return this.prisma.topicCreation.create({ data: {} });
  }
}

export { TopicCreationRepository };
