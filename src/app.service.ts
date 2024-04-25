import { Injectable } from '@nestjs/common';
import { TelegramService } from './infrastructure';

@Injectable()
export class AppService {
  constructor(private readonly telegramService: TelegramService) {}

  getHello(): any {
    return this.telegramService.getPosts("-1002051506474", 5)
  }
}
