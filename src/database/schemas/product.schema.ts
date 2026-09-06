import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  _id: false,
})
export class ProductImage {
  @Prop({
    required: true,
    trim: true,
  })
  url!: string;

  @Prop({
    required: true,
    trim: true,
  })
  publicId!: string;

  @Prop({
    trim: true,
  })
  alt?: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  // =====================
  // BASIC INFORMATION
  // =====================

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  })
  slug!: string;

  @Prop({
    required: true,
    trim: true,
  })
  description!: string;

  @Prop({
    trim: true,
  })
  shortDescription?: string;

  // =====================
  // PRICE
  // =====================

  @Prop({
    required: true,
    min: 0,
    index: true,
  })
  price!: number;

  @Prop({
    default: 0,
    min: 0,
  })
  discountPrice!: number;

  // =====================
  // STOCK
  // =====================

  @Prop({
    default: 0,
    min: 0,
    index: true,
  })
  stock!: number;

  // =====================
  // IMAGE
  // =====================

  @Prop({
    type: [ProductImageSchema],
    default: [],
  })
  images!: ProductImage[];

  // =====================
  // CATEGORY / BRAND
  // =====================

  @Prop({
    required: true,
    index: true,
  })
  categoryId!: string;

  @Prop({
    trim: true,
    index: true,
  })
  brand?: string;

  // =====================
  // STATUS
  // =====================

  @Prop({
    default: true,
    index: true,
  })
  isActive!: boolean;

  @Prop({
    default: false,
    index: true,
  })
  isFeatured!: boolean;

  // =====================
  // RATING
  // =====================

  @Prop({
    default: 0,
    min: 0,
    max: 5,
  })
  rating!: number;

  @Prop({
    default: 0,
  })
  reviewCount!: number;

  @Prop({
    default: 0,
    index: true,
  })
  soldCount!: number;

  // =====================
  // SEO
  // =====================

  @Prop({
    trim: true,
    maxLength: 60,
  })
  metaTitle?: string;

  @Prop({
    trim: true,
    maxLength: 160,
  })
  metaDescription?: string;

  @Prop({
    type: [String],
    default: [],
  })
  metaKeywords!: string[];

  // =====================
  // SOFT DELETE
  // =====================

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// ProductSchema.index({
//   name: 'text',
//   description: 'text',
//   brand: 'text',
// });

// ProductSchema.index({
//   categoryId: 1,
//   isActive: 1,
//   deletedAt: 1,
// });

// ProductSchema.index({
//   price: 1,
// });

// ProductSchema.index({
//   soldCount: -1,
// });

// ProductSchema.index({
//   createdAt: -1,
// });
