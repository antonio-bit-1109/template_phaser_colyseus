import {defineConfig} from 'vite';

export default defineConfig({
    base: './',
    logLevel: 'warning',
    esbuild: {
        keepNames: true,
        tsconfigRaw: {
            compilerOptions: {
                experimentalDecorators: true,
                useDefineForClassFields: false
            }
        }
    },
    build: {
        // --- MODIFICA QUI ---
        outDir: '../dist/client', // Mette i file compilati in dist/client
        emptyOutDir: true,        // Pulisce la cartella prima di scrivere
        // --------------------
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {passes: 2},
            mangle: true,
            format: {comments: false}
        }
    },
    // Rimuovi la config server qui, in build non serve
});