import { Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma';
import { User } from 'src/domain/models/user';
import { RegisterDto } from 'src/infrastructure/auth/dto/register.dto';

class UserRepository {
  constructor(
    @Inject(forwardRef(() => PrismaService)) private prisma: PrismaService,
  ) {}

  async getAllWithPagination(
    limit: number,
    offset: number,
  ): Promise<[User[], number]> {
    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        take: limit,
        skip: offset,
      }),
      this.prisma.user.count(),
    ]);

    return [users, totalCount];
  }

  getById(id: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  getByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  create(user: RegisterDto): Promise<User> {
    return this.prisma.user.create({ data: { ...user } });
  }
}

export { UserRepository };
