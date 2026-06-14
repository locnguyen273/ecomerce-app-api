import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  // z.coerce automatically converts string '3000' from process.env to number 3000
  PORT: z.coerce.number(), 
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
});

// Automatically infers the TypeScript type from the schema
export type EnvironmentVariables = z.infer<typeof environmentSchema>;

export function validate(config: Record<string, any>): EnvironmentVariables {
  const result = environmentSchema.safeParse(config);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Config validation error');
  }

  return result.data;
}
