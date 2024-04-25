import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { CanOperate, Channel } from 'src/domain/models';

class CanOperateRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async create(data: CanOperate): Promise<CanOperate> {
    const { account, channel, ...dataWithoutIds } = data;
    const record = await this.prisma.canOperate.create({
      data: {
        ...dataWithoutIds,
        channelId: data.channel.id,
        accountId: data.account.id
      },
      include: {

        channel: true,
        account: true
      }
    });

    return record;
  }
}

export { CanOperateRepository };
