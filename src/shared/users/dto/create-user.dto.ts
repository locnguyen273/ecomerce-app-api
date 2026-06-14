import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
// import { UserDocument } from '@database/schemas/user.schema';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'username' })
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @MinLength(6)
  password!: string;
}
