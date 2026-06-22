import { Module } from '@nestjs/common';
import { AuthModule } from '@shared/auth/auth.module';
import { UsersModule } from '@shared/users/users.module';
import { ProductsModule } from '@shared/products/products.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, CategoryModule],
  controllers: [],
  providers: [],
  exports: [AuthModule, UsersModule, ProductsModule, CategoryModule],
})
export class SharedModule {}
