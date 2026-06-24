import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '@database/schemas/category.schema';
import { Model, Query } from 'mongoose';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  create(data: Partial<Category>): Promise<CategoryDocument> {
    return this.categoryModel.create(data);
  }

  findOne(filter: Record<string, any>): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne(filter);
  }

  findMany(filter: Record<string, any>, skip: number, limit: number): Promise<CategoryDocument[]> {
    return this.categoryModel.find(filter).skip(skip).limit(limit).exec();
  }

  findById(id: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findById(id);
  }

  update(id: string, data: Partial<Category>): Promise<CategoryDocument | null> {
    return this.categoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  delete(id: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  paginate(filter: Record<string, any>): Query<CategoryDocument[], CategoryDocument> {
    return this.categoryModel.find(filter);
  }

  count(filter: Record<string, any>): Promise<number> {
    return this.categoryModel.countDocuments(filter);
  }
}
