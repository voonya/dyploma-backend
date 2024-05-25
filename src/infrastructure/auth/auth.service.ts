import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../../dal/entities/user';
import { comparePasswords, hash } from './utils/bcrypt.utils';
import { createToken } from './utils/jwt.utils';

const JWT_ACCESS_SECRET = 'secret';
const JWT_ACCESS_EXPIRES = '24h';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(data: RegisterDto) {
    const { username, password } = data;
    const user = await this.userRepository.getByUsername(username);

    if (!user) {
      throw new Error('Incorrect username or password!');
    }

    const isCorrectPassword = await comparePasswords(user.password, password);

    if (!isCorrectPassword) {
      throw new Error('Incorrect username or password!');
    }

    const { password: passwordUser, ...userWithoutPassword } = user;

    const tokens = this.createTokens(user);

    return { tokens, user: userWithoutPassword };
  }

  async register(data: RegisterDto) {
    const { username, password } = data;
    const userByUserName = await this.userRepository.getByUsername(username);

    if (userByUserName) {
      throw new Error('Username already taken!');
    }

    const hashPassword = await hash(password);

    const user = await this.userRepository.create({
      username,
      password: hashPassword,
    });

    const tokens = this.createTokens(user);

    return { tokens, user };
  }

  private createTokens(user: any) {
    const accessToken = this.createAccessToken(user);

    return { accessToken };
  }

  private createAccessToken(user: any): string {
    return createToken(user, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES);
  }
}
