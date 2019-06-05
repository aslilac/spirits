export default [{
  input: 'lib/spirits.js',
  external: [ 'gardens' ],
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
  external: [ 'gardens', 'string-spirits' ],
  output: {
    format: 'umd',
    file: 'tests/index.bundle.js',
    name: 'tests',
    sourcemap: true,
    globals: {
      'gardens': 'gardens',
      '..': 'Spirit'
    },
    exports: 'named'
  }
}]
