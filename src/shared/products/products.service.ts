import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { generateSlug } from '@common/utils/slug.util';
import { CreateProductDto } from '@shared/products/dto/create-product.dto';
import { QueryProductDto } from '@shared/products/dto/query-product.dto';
import { UpdateProductDto } from '@shared/products/dto/update-product.dto';
import { ProductRepository } from '@common/repositories/product.repository';
import { Product, ProductImage } from '@database/schemas/product.schema';
import { QueryFilter } from 'mongoose';
import { ProductSort } from '@common/constants/products.constant';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateProductDto, files?: Express.Multer.File[]) {
    const slug = await this.generateUniqueSlug(dto.name);

    let uploadedImages: ProductImage[] = [];

    try {
      if (files?.length) {
        const uploadResults = await this.cloudinaryService.uploadImages(
          files,
          'ecommerce/products',
        );

        uploadedImages = uploadResults.map((image) => ({
          url: image.secure_url,
          publicId: image.public_id,
          alt: dto.name,
        }));
      }

      const product = await this.productRepository.create({
        ...dto,
        slug,
        images: uploadedImages,
        discountPrice: dto.discountPrice ?? 0,
        stock: dto.stock ?? 0,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        metaTitle: dto.metaTitle ?? dto.name.slice(0, 60),
        metaDescription: dto.metaDescription ?? dto.shortDescription ?? dto.description.slice(0, 160),
        metaKeywords: dto.metaKeywords ?? [],
      });

      return {
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      // Nếu DB create fail
      // xóa những ảnh vừa upload
      if (uploadedImages.length) {
        await this.cloudinaryService.deleteImages(uploadedImages.map((image) => image.publicId));
      }
      throw error;
    }
  }

  async findAll(query: QueryProductDto) {
    const {
      page = 1,
      limit = 10,
      keyword,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      isActive,
      isFeatured,
      sort = ProductSort.NEWEST,
    } = query;

    const filter: QueryFilter<Product> = {
      deletedAt: null,
    };
    // SEARCH
    if (keyword) {
      filter.$or = [
        {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          brand: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    // CATEGORY
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // BRAND
    if (brand) {
      filter.brand = brand;
    }

    // STATUS
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    // PRICE
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {
        ...(minPrice !== undefined && {
          $gte: minPrice,
        }),
        ...(maxPrice !== undefined && {
          $lte: maxPrice,
        }),
      };
    }
    // SORT
    const sortOptions: Record<ProductSort, Record<string, 1 | -1>> = {
      [ProductSort.NEWEST]: { createdAt: -1 },
      [ProductSort.OLDEST]: { createdAt: 1 },
      [ProductSort.PRICE_ASC]: { price: 1 },
      [ProductSort.PRICE_DESC]: { price: -1 },
      [ProductSort.BEST_SELLING]: { soldCount: -1 },
      [ProductSort.RATING]: { rating: -1 },
    };
    const result = await this.productRepository.findAll(filter, page, limit, sortOptions[sort]);

    return {
      message: 'Products retrieved successfully',
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  // ==========================
  // FIND BY SLUG
  // ==========================

  async findBySlug(slug: string) {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  // ==========================
  // UPDATE
  // ==========================

  async update(id: string, dto: UpdateProductDto, files?: Express.Multer.File[]) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    let uploadedImages: ProductImage[] = [];
    try {
      // =====================
      // UPLOAD NEW IMAGE
      // =====================

      if (files?.length) {
        const uploadResults = await this.cloudinaryService.uploadImages(
          files,
          'ecommerce/products',
        );
        uploadedImages = uploadResults.map((image) => ({
          url: image.secure_url,
          publicId: image.public_id,
          alt: dto.name ?? existingProduct.name,
        }));
      }

      // =====================
      // UPDATE SLUG
      // =====================

      let slug: string | undefined;

      if (dto.name && dto.name !== existingProduct.name) {
        slug = await this.generateUniqueSlug(dto.name, id);
      }

      // =====================
      // PREPARE DATA
      // =====================

      const updateData: Record<string, any> = {
        ...dto,
      };

      if (slug) {
        updateData.slug = slug;
      }

      // Nếu upload ảnh mới
      // replace toàn bộ ảnh cũ

      if (uploadedImages.length) {
        updateData.images = uploadedImages;
      }

      // =====================
      // UPDATE DATABASE
      // =====================

      const updatedProduct = await this.productRepository.update(id, updateData);

      if (!updatedProduct) {
        throw new BadRequestException('Cannot update product');
      }

      // =====================
      // DELETE OLD CLOUDINARY
      // ONLY AFTER DB SUCCESS
      // =====================

      if (uploadedImages.length && existingProduct.images?.length) {
        await this.cloudinaryService.deleteImages(
          existingProduct.images.map((image) => image.publicId as string),
        );
      }

      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      // Nếu update database fail
      // rollback ảnh mới upload

      if (uploadedImages.length) {
        await this.cloudinaryService.deleteImages(uploadedImages.map((image) => image.publicId));
      }
      throw error;
    }
  }

  // ==========================
  // SOFT DELETE
  // ==========================

  async softDelete(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const deletedProduct = await this.productRepository.softDelete(id);

    return {
      message: 'Product deleted successfully',

      data: deletedProduct,
    };
  }

  // ==========================
  // HARD DELETE
  // ==========================

  async hardDelete(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 1. DELETE DB

    await this.productRepository.hardDelete(id);

    // 2. DELETE CLOUDINARY

    if (product.images?.length) {
      await this.cloudinaryService.deleteImages(product.images.map((image) => image.publicId as string));
    }

    return {
      message: 'Product permanently deleted successfully',
    };
  }

  // ==========================
  // GENERATE UNIQUE SLUG
  // ==========================

  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = generateSlug(name);
    let slug: string = baseSlug;
    let counter: number = 1;
    while (await this.productRepository.existsBySlug(slug, excludeId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }
}
