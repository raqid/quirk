import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'backend',
          include: ['backend/**/*.test.{js,ts}'],
          environment: 'node',
          globals: true,
          clearMocks: true,
          restoreMocks: true,
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'web/src'),
            'lucide-react': path.resolve(__dirname, 'web/src/__mocks__/lucide-react.tsx'),
          },
        },
        test: {
          name: 'web',
          include: ['web/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          globals: true,
          clearMocks: true,
          restoreMocks: true,
          setupFiles: ['./web/test-setup.ts'],
        },
      },
    ],
  },
});
