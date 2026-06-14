import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

@Schema({ _id: false })
class Address {
  @Prop({ required: true })
  fullName?: string;

  @Prop({ required: true })
  phone?: string;

  @Prop({ required: true })
  street?: string;

  @Prop()
  ward?: string;

  @Prop()
  district?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  @Prop({ default: false })
  isDefault?: boolean;
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email?: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop({
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider?: AuthProvider;

  @Prop()
  providerId?: string;

  @Prop({ required: true, trim: true })
  username?: string;

  @Prop()
  fullName?: string;

  @Prop()
  avatar?: string;

  @Prop()
  phone?: string;

  @Prop({
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop()
  refreshToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ type: [AddressSchema], default: [] })
  addresses?: Address[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.index({ email: 1 });
// UserSchema.index({ role: 1 });

// UserSchema.set('toJSON', {
//   virtuals: true,
//   transform: (_, ret) => {
//     delete ret.password;
//     delete ret.__v;
//     return ret;
//   },
// });
