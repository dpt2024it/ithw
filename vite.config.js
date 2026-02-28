import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        register: resolve(__dirname, 'src/pages/register.html'),
        assignments: resolve(__dirname, 'src/pages/assignments.html'),
        assignment: resolve(__dirname, 'src/pages/assignment.html'),
        solution: resolve(__dirname, 'src/pages/solution.html'),
        discussions: resolve(__dirname, 'src/pages/discussions.html'),
        profile: resolve(__dirname, 'src/pages/profile.html'),
        admin: resolve(__dirname, 'src/pages/admin.html'),
      },
    },
    outDir: 'dist',
  },
});
