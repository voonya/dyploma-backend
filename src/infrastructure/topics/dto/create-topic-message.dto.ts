import { IsString } from 'class-validator';

export class CreateTopicMessageDto {
  @IsString()
  message: string;
}
