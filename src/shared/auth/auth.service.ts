import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@shared/auth/dto/login.dto';
import { RegisterDto } from '@shared/auth/dto/register.dto';
import { UserDocument } from '@database/schemas/user.schema';
import { UsersRepository } from '@/common/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserDocument> {
    const existUser = await this.usersRepository.findByEmail(dto.email);
    if (existUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });
    return user;
  }

  async login(dto: LoginDto): Promise<{ accessToken: string}> {
    const user = await this.usersRepository.findByEmail(dto.email) as UserDocument;
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return await this.usersRepository.findById(userId);
  }
}
