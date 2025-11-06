import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from './schema/auth';
import * as summarySchema from './schema/summary';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...summarySchema },
});

export * from './schema/auth';
export * from './schema/summary';
