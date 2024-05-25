import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { Account } from 'src/domain/models';

export class AccountRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async getAll(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  async getAllWithPagination(
    limit: number,
    offset: number,
  ): Promise<[Account[], number]> {
    const [accounts, totalCount] = await Promise.all([
      this.prisma.account.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.account.count(),
    ]);

    return [accounts, totalCount];
  }

  async createAccount(account: Account): Promise<Account> {
    return this.prisma.account.create({
      data: account,
    });
  }

  async deleteAccount(accountId: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { id: accountId },
    });
  }
}
