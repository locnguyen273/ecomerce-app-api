import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(6)
  password!: string;
}
