import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@database/schemas/product.schema';
import { ProductController } from '@shared/products/products.controller';
import { ProductsService } from '@shared/products/products.service';
import { ProductRepository } from '@common/repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductsService, ProductRepository],
  exports: [ProductsService],
})
export class ProductModule {}
