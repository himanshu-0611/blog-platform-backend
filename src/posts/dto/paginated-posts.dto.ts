import { IsInt, Min } from 'class-validator';

export class PaginatedPostsDto {
  @IsInt()
  @Min(1)
  page_size: number;

  @IsInt()
  @Min(1)
  page_number: number;
}
