import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var repoName = 'compliance-training';
export default defineConfig({
    plugins: [react()],
    base: "/".concat(repoName, "/"),
});
