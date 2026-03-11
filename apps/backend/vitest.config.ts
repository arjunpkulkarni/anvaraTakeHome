import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import path from 'path';

// Load .env from workspace root
config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
    testTimeout: 30000,
  },
});
