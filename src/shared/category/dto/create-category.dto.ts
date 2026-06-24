import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value ? new Types.ObjectId(value as string) : undefined))
  parentId?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;
}
