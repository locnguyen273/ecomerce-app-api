import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { CategoryRepository } from '@/common/repositories/category.repository';
import { CreateCategoryDto } from '@shared/category/dto/create-category.dto';
import { QueryCategoryDto } from '@shared/category/dto/query-category.dto';
import { UpdateCategoryDto } from '@shared/category/dto/update-category.dto';
import { CategoryDocument } from '@database/schemas/category.schema';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(dto: CreateCategoryDto): Promise<{ message: string; data: CategoryDocument }> {
    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
    });
    const existed = await this.categoryRepository.findOne({
      slug,
    });
    if (existed) {
      throw new BadRequestException('Category already exists');
    }
    const category = await this.categoryRepository.create({
      ...dto,
      slug,
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : undefined,
    });
    return {
      message: 'Create category success',
      data: category,
    };
  }

  async findAll(query: QueryCategoryDto): Promise<{
    data: CategoryDocument[];
    meta: {
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    };
  }> {
    const { page = 1, limit = 10, search } = query;
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }
    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      this.categoryRepository.findMany(filter, skip, limit),
      this.categoryRepository.count(filter),
    ]);
    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryRepository.update(id, dto);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.delete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      message: 'Deleted successfully',
    };
  }
}
