import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePostDto {
  @IsString()
  idInSocial: string;

  @IsString()
  msg: string;

  @IsOptional()
  @IsBoolean()
  isPropagandaPredicted: boolean | null;

  @IsOptional()
  @IsBoolean()
  isPropaganda: boolean | null;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  socialCreationDate: Date;
}
