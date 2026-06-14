import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@shared/users/users.service';
import { LoginDto } from '@shared/auth/dto/login.dto';
import { RegisterDto } from '@shared/auth/dto/register.dto';
import { UserDocument } from '@database/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string; user: any }> {
    const existUser = await this.usersService.findByEmail(dto.email);

    if (existUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
    });
    return {
      message: 'Register success',
      user,
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user,
    };
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.usersService.findById(userId);
  }
}
