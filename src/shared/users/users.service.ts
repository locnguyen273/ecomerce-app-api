import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '@/common/repositories/users.repository';
import { CreateUserDto } from '@shared/users/dto/create-user.dto';
import { QueryUserDto } from '@shared/users/dto/query-user.dto';
import { UpdateUserDto } from '@shared/users/dto/update-user.dto';
import { UserDocument } from '@database/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<{message: string; data: UserDocument}> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return {
      message: 'Register success',
      data: user,
    };
  }

  async findAll(query: QueryUserDto): Promise<{
    data: UserDocument[];
    meta: {
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    };
  }> {
    const { page = 1, limit = 10, search } = query;
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.usersRepository.findMany(filter, skip, limit),
      this.usersRepository.count(filter),
    ]);
    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.usersRepository.update(id, dto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.delete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'Deleted successfully',
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email);
  }
}
