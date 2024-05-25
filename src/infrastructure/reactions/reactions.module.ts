import { Module } from '@nestjs/common';

import { RepositoriesModule } from '../../dal/entities/repositories.module';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';

@Module({
  imports: [RepositoriesModule],

  providers: [ReactionsService],
  controllers: [ReactionsController],

  exports: [ReactionsService],
})
export class ReactionsModule {}
