import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  findOne(filter: Record<string, any>): Promise<UserDocument | null> {
    return this.userModel.findOne(filter).exec();
  }

  findMany(filter: Record<string, any>, skip: number, limit: number): Promise<UserDocument[]> {
    return this.userModel.find(filter).skip(skip).limit(limit).exec();
  }

  count(filter: Record<string, any>): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  update(id: string, payload: Partial<User>): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .exec();
  }

  delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
