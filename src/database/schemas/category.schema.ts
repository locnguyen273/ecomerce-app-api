import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
  collection: 'categories',
})
export class Category {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  slug!: string;

  @Prop()
  description?: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    default: null,
  })
  parentId?: Types.ObjectId;

  @Prop({
    default: 0,
  })
  sortOrder!: number;

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
