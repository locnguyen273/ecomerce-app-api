import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/constants/role.constant';
import { CategoryDocument } from '@database/schemas/category.schema';
@ApiTags('Categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<{ message: string; data: CategoryDocument }> {
    return this.categoriesService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  findAll(@Query() query: QueryCategoryDto): Promise<{
    data: CategoryDocument[];
    meta: {
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    };
  }> {
    return this.categoriesService.findAll(query);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryDocument> {
    return this.categoriesService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<CategoryDocument> {
    return this.categoriesService.update(id, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoriesService.remove(id);
  }
}
