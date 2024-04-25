import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { Post } from 'src/domain/models';

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
}

export { PostRepository };
