import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId?: Types.ObjectId;

  @Prop({ required: true })
  quantity?: number;

  @Prop({ required: true })
  price?: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId?: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], default: [] })
  items?: OrderItem[];

  @Prop({ required: true })
  totalAmount?: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status?: OrderStatus;

  @Prop()
  paymentMethod?: string;

  @Prop()
  shippingAddress?: string;

  @Prop()
  trackingNumber?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);