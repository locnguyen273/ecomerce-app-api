import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@database/database.module';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required().messages({
          'any.required': 'DATABASE_URL is strictly required to connect to the database.',
        }),
      }) as unknown as any,
    }),
    DatabaseModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
