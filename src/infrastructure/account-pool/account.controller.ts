import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from '@nestjs/common';

import { PaginationDto } from 'src/domain/dto/pagination.dto';
import { AccountPoolService } from './account-pool.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountPoolService) {}

  @Get()
  async getAccounts(@Query() queryParam: PaginationDto) {
    const data = await this.accountsService.getPaginatedAccounts(queryParam);

    console.log(queryParam);

    return { data };
  }

  @Post('/code')
  async sendCode(@Body() request: CreateAccountDto) {
    const data = await this.accountsService.sendCode(request);

    return { data };
  }

  @Post()
  async createAccount(@Body() request: CreateAccountDto) {
    const data = await this.accountsService.createAccount(request);

    return { data };
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: string) {
    const data = await this.accountsService.deleteAccount(id);

    return { data };
  }
}
