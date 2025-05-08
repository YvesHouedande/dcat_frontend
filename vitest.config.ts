/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true, // ✅ permet d'utiliser describe(), it(), expect() sans import
    environment: 'node', // ou 'jsdom' pour le DOM
    include: ['src/test/**/*.test.ts'], // adapte selon l'emplacement de tes tests
  },
});
