import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAccountDto {
  @IsString()
  apiHash: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  apiId: number;

  @IsString()
  session: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  phoneCodeHash?: string;
}
