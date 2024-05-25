// Define a DTO for pagination
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit?: number = 10;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number = 1;
}
