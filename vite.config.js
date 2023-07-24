import { defineConfig } from 'vite';
import path from 'path';

/**
 * @project FA WebComponents
 * 
 * @file vite.config.js
 * @description vite config file for bundling the lit components into a single file
 * 
 */

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: 'src/main.ts',
            name: 'FAWebComponents',
            fileName: (format) => `fa-web-components.${format}.js`,
            formats: ['iife']
        },
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@decorators': path.resolve(__dirname, './src/decorators'),
            '@': path.resolve(__dirname, './src'),
        }
    }
});