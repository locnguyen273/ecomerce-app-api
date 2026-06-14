import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@database/schemas/user.schema';
import { CreateUserDto, CreateUserResponse } from '@shared/users/dto/create-user.dto';
import { QueryUserDto } from '@shared/users/dto/query-user.dto';
import { UpdateUserDto } from '@shared/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<CreateUserResponse> {
    const existUser = await this.userModel.findOne({ email: dto.email });

    if (existUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    });
    return {
      message: 'Register success',
      data: user,
    };
  }

  async findAll(query: QueryUserDto): Promise<{ data: UserDocument[]; meta: any }> {
    const { page = 1, limit = 10, search } = query;
    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findOne(id: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument | null> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Deleted successfully' };
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
}
