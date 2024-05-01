import { IsBoolean, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { PaginationDto } from "src/domain/dto/pagination.dto";

export class GetPostsWithFilters extends PaginationDto {
    @IsOptional()
    @Transform(({ value} ) => value == 'null' ? null : value === 'true')
    isPropaganda?: boolean | null;

    @Transform(({ value} ) => value == 'null' ? null : value === 'true')
    @IsOptional()
    isPropagandaPredicted?: boolean | null;
}