import { IsNumber, IsString } from "class-validator";

export class CreateReactionDto {
    @IsString()
    reaction: string;

    @IsNumber()
    rank: number;
}