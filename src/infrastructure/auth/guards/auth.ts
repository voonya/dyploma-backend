import type { CanActivate, ExecutionContext } from '@nestjs/common';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserRepository } from 'src/dal/entities/user';
import { parseToken } from '../utils/jwt.utils';
import { User } from 'src/domain/models/user';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorization = req?.headers?.authorization?.split(' ');

    if (!authorization) {
      throw new UnauthorizedException('Jwt should be provided!');
    }

    if (authorization[0] !== 'Bearer' || !authorization[1]) {
      throw new UnauthorizedException('Jwt malformed!');
    }

    const user = parseToken<User>(authorization[1], 'secret');

    if (!user) {
      throw new UnauthorizedException('Invalid jwt!');
    }

    const userInDb = await this.userRepository.getById(user.id);
    if (!userInDb) {
      throw new BadRequestException('User does not exist!');
    }

    const { password, ...userWithoutPassword } = userInDb;
    req.user = userWithoutPassword;

    return true;
  }
}
