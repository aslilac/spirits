export default [{
  input: 'src/spirits.js',
  output: {
    format: 'umd',
    file: 'dist/spirits.js',
    name: 'Spirit',
    sourcemap: true,
    globals: {
      'gardens': 'gardens'
    }
  }
}, {
  input: 'tests/index.js',
  output: {
    format: 'umd',
    file: 'tests/rollup.js',
    name: 'tests',
    sourcemap: true,
    globals: {
      'gardens': 'gardens',
      'string-spirits': 'Spirit'
    }
  }
}]
