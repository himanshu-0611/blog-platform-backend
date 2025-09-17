import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginatedPostsDto {
  @IsInt()
  @Min(1)
  page_size: number;

  @IsInt()
  @Min(1)
  page_number: number;

  @IsOptional()
  @IsString()
  search_by_title?: string;

  @IsOptional()
  @IsString()
  search_by_content?: string;
}
