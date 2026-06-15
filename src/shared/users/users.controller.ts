import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '@shared/users/users.service';
import { CreateUserDto } from '@shared/users/dto/create-user.dto';
import { UpdateUserDto } from '@shared/users/dto/update-user.dto';
import { QueryUserDto } from '@shared/users/dto/query-user.dto';
import { UserDocument } from '@database/schemas/user.schema';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/constants/role.constant';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() dto: CreateUserDto): Promise<{message: string; data: UserDocument}> {
    return this.usersService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  @ApiOperation({ summary: 'Get all users (pagination + search)' })
  findAll(@Query() query: QueryUserDto): Promise<{
    data: UserDocument[];
    meta: {
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    };
  }> {
    return this.usersService.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string): Promise<UserDocument> {
    return this.usersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserDocument> {
    return this.usersService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
