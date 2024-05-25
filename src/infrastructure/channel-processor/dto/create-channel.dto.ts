import { IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  link: string;
}
