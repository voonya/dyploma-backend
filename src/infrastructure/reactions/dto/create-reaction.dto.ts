import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReactionDto {
  @IsString()
  reaction: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  rank: number;
}
