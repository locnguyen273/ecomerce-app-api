import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryCategoryDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
