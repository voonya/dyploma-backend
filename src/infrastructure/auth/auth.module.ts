import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { RepositoriesModule } from '../../dal/entities/repositories.module';
import { AuthService } from './auth.service';

@Module({
  imports: [RepositoriesModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
