import { IsInt, IsOptional, IsString, Min, Max, Length } from 'class-validator';

export class PaginatedPostsDto {
  @IsInt()
  @Min(1, { message: 'page_number must be at least 1' })
  page_number: number;

  @IsInt()
  @Min(1, { message: 'page_size must be at least 1' })
  @Max(100, { message: 'page_size cannot exceed 100' })
  page_size: number;

  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'search_by_title cannot exceed 255 characters' })
  search_by_title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'search_by_content cannot exceed 255 characters' })
  search_by_content?: string;
}
