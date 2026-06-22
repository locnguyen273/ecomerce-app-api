import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { CategoryRepository } from '@/common/repositories/category.repository';
import { CreateCategoryDto } from '@shared/category/dto/create-category.dto';
import { QueryCategoryDto } from '@shared/category/dto/query-category.dto';
import { UpdateCategoryDto } from '@shared/category/dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(dto: CreateCategoryDto) {
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

    return this.categoryRepository.create({
      ...dto,
      slug,
    });
  }

  async findAll(query: QueryCategoryDto) {
    const page = Number(query.page);
    const limit = Number(query.limit);

    const filter: Record<string, unknown> = {
      deletedAt: null,
    };

    if (query.keyword) {
      filter.name = {
        $regex: query.keyword,
        $options: 'i',
      };
    }

    const [items, total] = await Promise.all([
      this.categoryRepository
        .paginate(filter)
        .skip((page - 1) * limit)
        .limit(limit),

      this.categoryRepository.count(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.update(id, dto);

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  async remove(id: string) {
    return this.categoryRepository.softDelete(id);
  }
}
