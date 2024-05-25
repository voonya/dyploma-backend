import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { PostOperation } from 'src/domain/models';

class PostOperationRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async create(data: PostOperation): Promise<PostOperation> {
    const { account, post, reaction, comment, ...dataWithoutIds } = data;
    const record = await this.prisma.postOperation.create({
      data: {
        ...dataWithoutIds,
        postId: data.post.id,
        accountId: data.account.id,
        reactionId: data.reaction?.id,
        commentId: data.comment?.id,
      },
      include: {
        post: true,
        account: true,
        comment: true,
        reaction: true,
      },
    });

    return record;
  }

  async createOrUpdate(data: PostOperation): Promise<PostOperation> {
    const { account, post, reaction, comment, ...dataWithoutIds } = data;

    const operation = await this.prisma.postOperation.findFirst({
      where: {
        postId: data.post.id,
        accountId: data.account.id,
      },
    });

    if (!operation) {
      return this.create(data);
    } else {
      return this.prisma.postOperation.update({
        where: {
          id: operation.id,
        },
        data: {
          ...dataWithoutIds,
          postId: data.post.id,
          accountId: data.account.id,
          reactionId: data.reaction?.id,
          commentId: data.comment?.id,
        },
        include: {
          post: true,
          account: true,
          comment: true,
          reaction: true,
        },
      });
    }
    // const record = await this.prisma.postOperation.upsert({
    //   where: {
    //     id: data.id || '00000000-0000-0000-0000-000000000000',
    //     // post: {
    //     //   id: data.post.id,
    //     // },
    //     // account: {
    //     //   id: data.account.id
    //     // }
    //   },
    //   update: {
    //     ...dataWithoutIds,
    //     postId: data.post.id,
    //     accountId: data.account.id
    //   },
    //   create: {
    //     ...dataWithoutIds,
    //     postId: data.post.id,
    //     accountId: data.account.id
    //   },
    //   include: {
    //     post: true,
    //     account: true
    //   }
    // });

    // return record;
  }

  async getAllWithPagination(
    limit: number,
    offset: number,
  ): Promise<[PostOperation[], number]> {
    const [posts, totalCount] = await Promise.all([
      this.prisma.postOperation.findMany({
        take: limit,
        skip: offset,
        include: {
          post: true,
          account: true,
          comment: true,
          reaction: true,
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
