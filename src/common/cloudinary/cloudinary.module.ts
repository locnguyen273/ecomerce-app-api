import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from '@common/cloudinary/cloudinary.service';
import { cloudinaryProvider } from '@common/cloudinary/cloudinary.config';

@Global()
@Module({
  providers: [cloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
