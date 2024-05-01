import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { CanOperate, Channel, PostOperation } from 'src/domain/models';

class PostOperationRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async create(data: PostOperation): Promise<PostOperation> {
    const { account, post, ...dataWithoutIds } = data;
    const record = await this.prisma.postOperation.create({
      data: {
        ...dataWithoutIds,
        postId: data.post.id,
        //accountId: data.account.id
      },
      include: {
        post: true,
        account: true
      }
    });

    return record;
  }

  async getAllWithPagination(limit: number, offset: number): Promise<[PostOperation[], number]> {
    const [posts, totalCount] = await Promise.all([
      this.prisma.postOperation.findMany({
          take: limit,
          skip: offset,
          include: {
            post: true,
            account: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
      }),
      this.prisma.postOperation.count(),
      ]);

      return [posts, totalCount];
  }
}

export { PostOperationRepository };