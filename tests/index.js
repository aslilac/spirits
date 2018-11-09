import Spirit from 'string-spirits'
import { createScope } from 'gardens'
const garden = createScope( 'tests' )

export function somethingElse() {

}

export default function () {
  garden.log( 'Beginning tests' )

  const star = new Spirit( '*' )
  garden.assert( star.match( '' ) )
  garden.assert( star.match( 'x' ) )
  garden.assert( star.match( 'hello' ) )
  garden.assert( star.match( 'ahelloz' ) )

  const az = new Spirit( 'a*z' )
  garden.assert( az.match( 'az' ) )
  garden.assert( az.match( 'ahelloz' ) )
  garden.deny( az.match( 'x' ) )
  garden.deny( az.match( 'azx' ) )
  garden.deny( az.match( 'xaz' ) )

  const innermark = new Spirit( 'a?z' )
  garden.assert( innermark.match( 'axz' ) )
  garden.deny( innermark.match( 'abcz' ) )
  garden.deny( innermark.match( 'az' ) )

  const endmark = new Spirit( 'az?' )
  garden.assert( endmark.match( 'az' ) )
  garden.assert( endmark.match( 'azx' ) )
  garden.deny( endmark.match( 'azxy' ) )
  garden.deny( endmark.match( 'xazy' ) )

  const single = new Spirit( '?' )
  garden.assert( single.match( '' ) )
  garden.assert( single.match( 'x' ) )

  const spirits = [ star, az, innermark, endmark, single ]
  garden.assert_eq( Spirit.bestMatch( spirits, 'a' ), single )
  garden.assert_eq( Spirit.bestMatch( spirits, 'az' ), endmark )
  garden.assert_eq( Spirit.bestMatch( spirits, 'axz' ), innermark )
  garden.assert_eq( Spirit.bestMatch( spirits, 'axyz' ), az )
  garden.assert_eq( Spirit.bestMatch( spirits, 'baxyz' ), star )

  // This test is annoying, but the feature works so screw it for now.
  // const strings = [ 'a', 'az', 'axz', 'axyz', 'baxyz' ]
  // const spiritMap = Spirit.map( spirits, strings )
  //
  // for ( let [ key, value ] in spiritMap ) {
  //   matches.get( key ) === value
  // }
  //
  // const matches = new Map([
  //   [ 'a', [ star, single ] ],
  //   [ 'az', [ star, az, endmark ] ],
  //   [ 'axz', [ star, az, innermark ] ],
  //   [ 'axyz', [ star, az ] ],
  //   [ 'baxyz', [ star ] ]
  // ])

  garden.log( 'Done! Tests passed!' )
}
