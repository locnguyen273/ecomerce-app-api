import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@shared/auth/auth.service';

import { LoginDto } from '@shared/auth/dto/login.dto';
import { RegisterDto } from '@shared/auth/dto/register.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtUser } from '@/common/interfaces/user.interface';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { UserDocument } from '@database/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<UserDocument> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto): Promise<{ accessToken: string}> {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user: JwtUser): Promise<JwtUser> {
    return Promise.resolve(user);
  }
}
