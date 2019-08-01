import test from 'ava';
import Spirit from '..';

const hey = 'hey';
const hi = 'hi';
const hello = 'hello';

test( 'Spirit should match source string', t => {
  const spirit = new Spirit( hi );
  t.true( spirit.match( hi ) );
  t.true( spirit.allMatch( hi, hi, hi, hi, hi ) );
});

test( 'Spirit should not match other strings', t => {
  const spirit = new Spirit( hi );

  t.false( spirit.match( hey ) );
  t.false( spirit.allMatch( hi, hi, hi, hi, hey ) );
});

test( 'Wildcard matches everything except empty', t => {
  const spirit = new Spirit( '*' );

  t.true( spirit.allMatch( hey, hi, hello ) );
  t.false( spirit.match( '' ) );
});

test( 'Single characters are filled in (begin, middle, and end)', t => {
  const h_ = new Spirit( 'h.' );
  const h_y = new Spirit( 'h.y' );
  const _ello = new Spirit( '.ello' );

  t.true( h_.match( hi ) );
  t.true( h_y.match( hey ) );
  t.true( _ello.match( hello ) );
});

test( 'Single characters only fill in one character', t => {
  const h_ = new Spirit( 'h.' );

  t.false( h_.match( hey ) );
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

// const innermark = new Spirit( 'a?z' )
// garden.assert( innermark.match( 'axz' ) )
// garden.deny( innermark.match( 'abcz' ) )
// garden.deny( innermark.match( 'az' ) )

// const endmark = new Spirit( 'az?' )
// garden.assert( endmark.match( 'az' ) )
// garden.assert( endmark.match( 'azx' ) )
// garden.deny( endmark.match( 'azxy' ) )
// garden.deny( endmark.match( 'xazy' ) )

// const single = new Spirit( '?' )
// garden.assert( single.match( '' ) )
// garden.assert( single.match( 'x' ) )

// const spirits = [ star, az, innermark, endmark, single ]
// garden.assert_eq( Spirit.bestMatch( spirits, 'a' ), single )
// garden.assert_eq( Spirit.bestMatch( spirits, 'az' ), endmark )
// garden.assert_eq( Spirit.bestMatch( spirits, 'axz' ), innermark )
// garden.assert_eq( Spirit.bestMatch( spirits, 'axyz' ), az )
// garden.assert_eq( Spirit.bestMatch( spirits, 'baxyz' ), star )
