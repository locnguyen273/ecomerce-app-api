import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function ConfigSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('e-commerce app API')
    .setDescription('API documentation for e-commerce app')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('e-commerce-api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
