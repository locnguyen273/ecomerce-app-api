import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';import { HydratedDocument } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId?: Types.ObjectId;

  @Prop({ required: true })
  quantity?: number;

  @Prop({ required: true })
  price?: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId?: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items?: CartItem[];

  @Prop({ default: 0 })
  totalAmount?: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);