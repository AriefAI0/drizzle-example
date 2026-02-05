import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite', // Use 'sqlite' for local .db files
  dbCredentials: {
    url: 'file:local.db', // This creates the "local.db" file in your root
  },
});