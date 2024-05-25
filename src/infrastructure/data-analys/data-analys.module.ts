import { Module } from '@nestjs/common';

import { DataAnalysService } from './data-analys.service';

@Module({
  imports: [],
  providers: [DataAnalysService],
  exports: [DataAnalysService],
})
export class DataAnalysModule {}
