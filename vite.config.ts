import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'compliance-training';

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
});

