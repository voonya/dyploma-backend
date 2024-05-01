import { IsString, IsArray } from "class-validator";

export class CreateTopicMessageDto {
    @IsString()
    message: string;
}