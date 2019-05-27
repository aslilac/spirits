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
  external: [ 'string-spirits', 'gardens' ],
  output: {
    format: 'umd',
    file: 'tests/rollup.js',
    name: 'tests',
    sourcemap: true,
    globals: {
      'gardens': 'gardens',
      'string-spirits': 'Spirit'
    },
    exports: 'named'
  }
}]
