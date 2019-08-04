import test from 'ava';
import Spirit from '..';

const hey = 'hey';
const hi = 'hi';
const hello = 'hello';

test( 'Spirit has a correctly calculated strength property', t => {
  const weak = new Spirit( '12' );
  const medium = new Spirit( '1234**' );
  const strong = new Spirit( '123456***' );

  t.is( weak.strength, 2 );
  t.is( medium.strength, 4 );
  t.is( strong.strength, 6 );
});

test( 'Spirit should match source string', t => {
  const spirit = new Spirit( hi );

  t.true( spirit.match( hi ) );
  t.true( spirit.allMatch( hi, hi, hi, hi, hi ) );
});

test( 'Spirit should not match incorrectly', t => {
  const spirit = new Spirit( hi );

  t.false( spirit.match( hey ) );
  t.false( spirit.allMatch( hi, hi, hi, hi, hey ) );
});

test( 'Nothing matches empty strings', t => {
  const wildcard = new Spirit( '*' );
  const question = new Spirit( '?' );
  t.false( wildcard.match( '' ) );
  t.false( question.match( '' ) );
});

test( 'Wildcard matches everything', t => {
  const spirit = new Spirit( '*' );

  t.true( spirit.allMatch( hey, hi, hello ) );
});

test( 'allMatch works correctly', t => {
  const spirit = new Spirit( 'ab*cd' );

  t.true( spirit.allMatch( 'abbcd', 'abccd', 'abcd' ) );

  t.false( spirit.allMatch( 'abbcd', 'abccd', 'acbd' ) );
});

test( 'Only matches are returned from findMatches', t => {
  const spirit = new Spirit( 'ab*cd' );

  t.deepEqual(
    spirit.findMatches( 'abbcd', 'abccd', 'abcd', 'acbd', 'abbcde' ),
    [ 'abbcd', 'abccd', 'abcd' ]
  );
});

test( 'Single characters are filled in (begin, middle, and end)', t => {
  const h_ = new Spirit( 'h.' );
  const h_y = new Spirit( 'h.y' );
  const _ello = new Spirit( '.ello' );

  t.false( h_.match( 'h' ) );
  t.true( h_.match( hi ) );
  t.true( h_y.match( hey ) );
  t.true( _ello.match( hello ) );
});

test( 'Single characters only fill in one character', t => {
  const h_ = new Spirit( 'h.' );

  t.false( h_.match( hey ) );
});

test( 'Question marks are optional, but only at the end', t => {
  const required = new Spirit( 'ab?de' );
  const optional = new Spirit( 'abcd?' );

  t.false( required.match( 'abde' ) );
  t.true( required.match( 'abcde' ) );
  t.false( required.match( 'abcdef' ) );
  t.true( optional.match( 'abcd' ) );
  t.true( optional.match( 'abcde' ) );
  t.false( optional.match( 'abcdef' ) );
});

test( 'Escaped wildcards are treated properly', t => {
  const escaped = new Spirit( 'a \\* \\.' );

  t.true( escaped.match( 'a * .' ) );
  t.false( escaped.match( 'a xx x' ) );
});

test( 'Complex cases are handled correctly', t => {
  const spirit = new Spirit( 'abc*xyz' );

  t.false( spirit.match( 'abcdefghi' ) );
  t.true( spirit.match( 'abcxxxxxxxxyz' ) );
});

test( 'Static match works correctly', t => {
  t.true( Spirit.match( 'abc*xyz', 'abcdefgxyz' ) );
});

test( 'Static allMatch works correctly', t => {
  t.true( Spirit.allMatch( 'ab*cd', 'abbcd', 'abccd', 'abcd' ) );
  t.false( Spirit.allMatch( 'ab*cd', 'abbcd', 'abccd', 'acbd' ) );
});

test( 'Static findMatches works correctly', t => {
  t.deepEqual(
    Spirit.findMatches( 'ab*cd', 'abbcd', 'abccd', 'abcd', 'acbd', 'abbcde' ),
    [ 'abbcd', 'abccd', 'abcd' ]
  );
});

test( 'Static bestMatch should work correctly', t => {
  const patterns = [ '*', 'az', 'ab?', 'ab.', '.' ];

  t.is( Spirit.bestMatch( 'a', ...patterns ), '.' );
  t.is( Spirit.bestMatch( 'az', ...patterns ), 'az' );
  t.is( Spirit.bestMatch( 'ab', ...patterns ), 'ab?' );
  t.is( Spirit.bestMatch( 'abc', ...patterns ), 'ab.' );
  t.is( Spirit.bestMatch( 'baxyz', ...patterns ), '*' );
});

test( 'Static map should work correctly', t => {
  const patterns = [ '*', 'az', 'ab?', 'ab.', '.' ];
  const matches = [ 'a', 'az', 'ab', 'abc', 'baxyz' ];

  const map = Spirit.map( patterns, matches );

  t.deepEqual( map.get( '*' ), matches );
  t.deepEqual( map.get( 'az' ), [ 'az' ] );
  t.deepEqual( map.get( 'ab?' ), [ 'ab', 'abc' ] );
  t.deepEqual( map.get( 'ab.' ), [ 'abc' ] );
  t.deepEqual( map.get( '.' ), [ 'a' ] );
});
