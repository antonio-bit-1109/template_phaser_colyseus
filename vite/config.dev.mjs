import {defineConfig} from 'vite';

export default defineConfig({
    base: './',
    esbuild: {
        keepNames: true,
        tsconfigRaw: {
            compilerOptions: {
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                useDefineForClassFields: false // Fondamentale per Colyseus
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080
    }
});
