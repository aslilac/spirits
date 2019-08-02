import typescript from 'rollup-plugin-typescript2';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: 'lib/spirits.ts',
  plugins: [
    typescript(),
    minify({ comments: false })
  ],
  output: {
    format: 'umd',
    file: 'dist/spirits.js',
    name: 'Spirit',
    sourcemap: true
  }
}
