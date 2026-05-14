const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/chatbot.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/chatbot.min.js',
  format: 'iife',
  target: ['es2020'],
}).catch(() => process.exit(1));
