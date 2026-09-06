import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from '@shared/products/dto/create-product.dto';
import { QueryProductDto } from '@shared/products/dto/query-product.dto';
import { UpdateProductDto } from '@shared/products/dto/update-product.dto';
import { ProductsService } from '@shared/products/products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  // ==========================
  // CREATE
  // ==========================

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(new Error('Only image files are allowed'), false);
        }

        callback(null, true);
      },
    }),
  )
  create(
    @Body()
    dto: CreateProductDto,

    @UploadedFiles()
    files?: Express.Multer.File[],
  ) {
    return this.productsService.create(dto, files);
  }

  // ==========================
  // FIND ALL
  // ==========================

  @Get()
  findAll(
    @Query()
    query: QueryProductDto,
  ) {
    return this.productsService.findAll(query);
  }

  // ==========================
  // FIND BY SLUG
  // IMPORTANT:
  // MUST BEFORE :id
  // ==========================

  @Get('slug/:slug')
  findBySlug(
    @Param('slug')
    slug: string,
  ) {
    return this.productsService.findBySlug(slug);
  }

  // ==========================
  // FIND BY ID
  // ==========================

  @Get(':id')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.productsService.findById(id);
  }

  // ==========================
  // UPDATE
  // ==========================

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateProductDto,

    @UploadedFiles()
    files?: Express.Multer.File[],
  ) {
    return this.productsService.update(id, dto, files);
  }

  // ==========================
  // SOFT DELETE
  // ==========================

  @Delete(':id')
  softDelete(
    @Param('id')
    id: string,
  ) {
    return this.productsService.softDelete(id);
  }

  // ==========================
  // HARD DELETE
  // ==========================

  @Delete(':id/permanent')
  hardDelete(
    @Param('id')
    id: string,
  ) {
    return this.productsService.hardDelete(id);
  }
}
