import { Module } from '@nestjs/common';
import { AuthModule } from '@shared/auth/auth.module';
import { UsersModule } from '@shared/users/users.module';
import { ProductsModule } from '@shared/products/products.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule],
  controllers: [],
  providers: [],
  exports: [AuthModule, UsersModule, ProductsModule],
})
export class SharedModule {}
