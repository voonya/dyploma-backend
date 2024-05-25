import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { Post } from 'src/domain/models';
import { GetPostsWithFilters } from 'src/infrastructure/posts-processor/dto/get-posts-filters.dto';

class PostRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async createMany(data: Post[]): Promise<Post[]> {
    const posts = await this.prisma.$transaction(
      data.map((post) => {
        const { channel, topic, ...dataWithoutIds } = post;
        const obj = {
          ...dataWithoutIds,
          channelId: channel.id,
          topicId: topic?.id,
        };

        return this.prisma.post.create({ data: obj });
      }),
    );

    return posts;
  }

  async updateMany(data: Post[]): Promise<Post[]> {
    const posts = await this.prisma.$transaction(
      data.map((post) => {
        const { channel, topic, ...dataWithoutIds } = post;
        const obj = {
          ...dataWithoutIds,
          channelId: channel.id,
          topicId: topic?.id,
        };

        return this.prisma.post.update({
          data: obj,
          where: { id: post.id },
          include: { channel: true, topic: true },
        });
      }),
    );
    // const record = await this.prisma.post.createMany({
    //   data: data.map(el => {

    //   })
    // });

    return posts;
  }

  async getAllWithPaginationAndFilters(
    request: GetPostsWithFilters,
  ): Promise<[Post[], number]> {
    const { limit, page, ...otherFilters } = request;
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        take: request.limit,
        skip: (page - 1) * limit,
        include: {
          channel: true,
          topic: true,
        },
        orderBy: {
          socialCreationDate: 'desc',
        },
        where: {
          ...otherFilters,
        },
      }),
      this.prisma.post.count({ where: { ...otherFilters } }),
    ]);

    return [posts, totalCount];
  }

  getNotProcessed(): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { isPropagandaPredicted: null },
      include: { channel: true },
    });
  }

  update(data: Post): Promise<Post> {
    const { channel, topic, ...dataWithoutIds } = data;
    const obj = {
      ...dataWithoutIds,
      // channelId: channel.id,
      topicId: topic?.id,
    };

    return this.prisma.post.update({
      data: obj,
      where: { id: data.id },
      include: { channel: true },
    });
  }

  async getStats() {
    const [
      withPropaganda,
      withoutPropaganda,
      notProcessed,
      notModerated,
      total,
    ] = await Promise.all([
      this.prisma.post.count({ where: { isPropagandaPredicted: true } }),
      this.prisma.post.count({ where: { isPropagandaPredicted: false } }),
      this.prisma.post.count({ where: { isPropagandaPredicted: null } }),
      this.prisma.post.count({ where: { isPropaganda: null } }),
      this.prisma.post.count(),
    ]);

    return {
      withPropaganda,
      withoutPropaganda,
      notProcessed,
      notModerated,
      total,
    };
  }

  async test() {
    const channels = await this.prisma.channel.findMany();

    for (const channel of channels) {
      const lastPost = await this.prisma.post.findFirst({
        where: { channelId: channel.id },
        orderBy: { idInSocial: 'desc' },
      });

      console.log(channel.link, lastPost?.idInSocial);
      if (lastPost)
        await this.prisma.channel.update({
          where: { id: channel.id },
          data: { ...channel, lastPostIdInSocial: lastPost.idInSocial },
        });
    }
  }
}

export { PostRepository };
