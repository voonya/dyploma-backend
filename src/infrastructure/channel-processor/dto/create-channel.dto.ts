import { IsString, IsArray } from "class-validator";

export class CreateChannelDto {
    @IsString()
    link: string;

    @IsArray()
    accountIds: string[];
}