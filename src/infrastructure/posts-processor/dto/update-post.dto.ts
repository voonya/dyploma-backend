import { IsBoolean, IsDate, IsDateString, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdatePostDto {
    @IsString()
    idInSocial: string;

    @IsString()
    msg: string;

    @IsBoolean()
    isPropagandaPredicted: boolean;

    @IsOptional()
    @IsBoolean()
    isPropaganda: boolean | null;

    @IsDate()
    @Transform(({value}) => new Date(value))
    socialCreationDate: Date;
}