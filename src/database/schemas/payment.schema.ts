import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId?: Types.ObjectId;

  @Prop({ required: true })
  amount?: number;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status? : PaymentStatus;

  @Prop()
  provider?: string; // stripe, paypal

  @Prop()
  transactionId?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);