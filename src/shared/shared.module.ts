import { Module } from '@nestjs/common';
import { AuthModule } from '@shared/auth/auth.module';
import { UsersModule } from '@shared/users/users.module';
import { ProductModule } from '@shared/products/products.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, UsersModule, ProductModule, CategoryModule, CloudinaryModule],
  controllers: [],
  providers: [],
  exports: [AuthModule, UsersModule, ProductModule, CategoryModule, CloudinaryModule],
})
export class SharedModule {}
