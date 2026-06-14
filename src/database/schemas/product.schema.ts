import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name?: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ required: true })
  price?: number;

  @Prop({ default: 0 })
  discountPrice?: number;

  @Prop({ default: 0 })
  stock?: number;

  @Prop([String])
  images?: string[];

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ index: true })
  categoryId?: string;

  @Prop({ index: true })
  brand?: string;

  @Prop({ default: 0 })
  rating?: number;

  @Prop({ default: 0 })
  soldCount?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
