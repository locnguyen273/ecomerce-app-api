import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigSwagger } from '@config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  ConfigSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
