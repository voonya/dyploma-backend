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
        const { channel, ...dataWithoutIds } = post;
        const obj = {
            ...dataWithoutIds,
            channelId: channel.id,
        }
  
        return this.prisma.post.create({ data: obj })
      }),
   );
    // const record = await this.prisma.post.createMany({
    //   data: data.map(el => {
        
    //   })
    // });

    return posts;
  }

  async updateMany(data: Post[]): Promise<Post[]> {
    const posts = await this.prisma.$transaction(
      data.map((post) => {
        const { channel, ...dataWithoutIds } = post;
        const obj = {
          ...dataWithoutIds,
          channelId: channel.id,
        }

        return this.prisma.post.update({ data: obj, where: {id: post.id}, include: {channel: true} });
      }),
   );
    // const record = await this.prisma.post.createMany({
    //   data: data.map(el => {
        
    //   })
    // });

    return posts;
  }

  async getAllWithPaginationAndFilters(request: GetPostsWithFilters): Promise<[Post[], number]> {
    const {limit, page, ...otherFilters} = request;
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
          take: request.limit,
          skip: (page - 1) * limit,
          include: {
            channel: true
          },
          orderBy: {
            socialCreationDate: 'desc',
          },
          where: {
            ...otherFilters
          }
      }),
      this.prisma.post.count({where: {...otherFilters}}),
      ]);

      return [posts, totalCount];
  }

  getNotProcessed(): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { isPropagandaPredicted: null },
      include: {channel: true}
    });
  }

  update(data: Post): Promise<Post> {
    const {channel, ...anotherData} = data;
    return this.prisma.post.update({
      where: { id: data.id },
      data: anotherData,
    });
  }
}

export { PostRepository };
