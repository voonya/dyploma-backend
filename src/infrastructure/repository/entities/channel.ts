import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { Channel } from 'src/domain/models';
import { channel } from 'diagnostics_channel';

class ChannelRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  getAll(): Promise<Channel[]> {
    return this.prisma.channel.findMany({
      select: {
        id: true,
        idInSocial: true,
        link: true,
        title: true,
        description: true,
        availableReactions: true,
        lastPostIdInSocial: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getById(id: string): Promise<Channel | null> {
    return this.prisma.channel.findFirst({
      where: { id },
      select: {
        id: true,
        idInSocial: true,
        link: true,
        title: true,
        description: true,
        availableReactions: true,
        lastPostIdInSocial: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getByLink(link: string): Promise<Channel | null> {
    return this.prisma.channel.findFirst({
      where: { link },
      select: {
        id: true,
        idInSocial: true,
        link: true,
        title: true,
        description: true,
        availableReactions: true,
        lastPostIdInSocial: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  create(data: Channel): Promise<Channel> {
    return this.prisma.channel.create({
      data,
      select: {
        id: true,
        idInSocial: true,
        link: true,
        title: true,
        description: true,
        availableReactions: true,
        lastPostIdInSocial: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  update(data: Channel): Promise<Channel> {
    return this.prisma.channel.update({
      where: { id: data.id },
      data,
      select: {
        id: true,
        idInSocial: true,
        link: true,
        title: true,
        description: true,
        availableReactions: true,
        lastPostIdInSocial: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export { ChannelRepository };
