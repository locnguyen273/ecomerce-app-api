import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

const toError = (error: unknown): Error => {
  return error instanceof Error ? error : new Error(String(error));
};

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File, folder = 'ecommerce/products'): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(toError(error));
            return;
          }

          if (!result) {
            reject(new Error('Cloudinary upload failed'));
            return;
          }
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadImages(files: Express.Multer.File[], folder = 'ecommerce/products'): Promise<UploadApiResponse[]> {
    return Promise.all(files.map((file) => this.uploadImage(file, folder)));
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  }

  async deleteImages(publicIds: string[]): Promise<void> {
    if (!publicIds?.length) {
      return;
    }
    await Promise.all(publicIds.map((publicId) => this.deleteImage(publicId)));
  }
}
