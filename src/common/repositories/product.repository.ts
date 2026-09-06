import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { Product, ProductDocument } from '@database/schemas/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: Partial<Product>): Promise<ProductDocument> {
    return this.productModel.create(data);
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .exec();
  }

  async findBySlug(slug: string): Promise<ProductDocument | null> {
    return this.productModel
      .findOne({
        slug,
        deletedAt: null,
      })
      .exec();
  }

  async findOne(filter: QueryFilter<Product>): Promise<ProductDocument | null> {
    return this.productModel.findOne(filter).exec();
  }

  async findAll(
    filter: QueryFilter<Product>,
    page: number,
    limit: number,
    sort: Record<string, 1 | -1>,
  ): Promise<{
    items: ProductDocument[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),

      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      total,
    };
  }

  async update(id: string, data: UpdateQuery<ProductDocument>): Promise<ProductDocument | null> {
    return this.productModel
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async softDelete(id: string): Promise<ProductDocument | null> {
    return this.productModel
      .findByIdAndUpdate(
        id,
        {
          deletedAt: new Date(),
          isActive: false,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async hardDelete(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const filter: QueryFilter<ProductDocument> = { slug };
    if (excludeId) {
      filter._id = {
        $ne: excludeId,
      };
    }
    const product = await this.productModel.findOne(filter).select('_id').lean().exec();
    return product !== null;
  }
}
