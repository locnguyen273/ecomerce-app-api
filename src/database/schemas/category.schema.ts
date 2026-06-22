import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop()
  image?: string;

  @Prop({
    default: true,
  })
  isActive!: boolean;

  @Prop({
    default: null,
  })
  parentId?: string | null;

  @Prop({
    default: 0,
  })
  level!: number;

  @Prop({
    type: [String],
    default: [],
  })
  path!: string[];

  @Prop({
    default: 0,
  })
  sortOrder!: number;

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;

  @Prop({
    default: null,
  })
  deletedAt?: Date | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
