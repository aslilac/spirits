export default class Spirit {
  // The string used to create the Spirit.
  private _source: string;
  // Represents how specific the Spirit is.
  spirit: number;

  /**
   * @param source The string to use as the wildcard.
   */
  constructor( source: string ) {
    this._source = source;
    this.spirit = source.length;
    for ( let i = 0; i < source.length; i++ ) {
      if ( source.charAt( i ) === '*' ) this.spirit--;
    }
  }

  /**
   * Can be used as an alternate way to construct a [[Spirit]].
   * @param source The string to use as the wildcard.
   */
  static createSpirit( source: Spirit | string ): Spirit {
    return source instanceof Spirit
      ? source
      : new Spirit( source );
  }

  /**
   * Checks if a string matches against the wildcard.
   * @param against The string to compare to the wildcard.
   */
  match( against: string ): boolean {
    const source = this._source;
    let sourcePosition = 0;
    let againstPosition = 0;
    let resumeWildcardAt = null;
    // let resumeWildcardAt = [
    //   sourcePosition,
    //   againstPosition
    // ];

    for (
      ; // Needs to be initialized above so that it doesn't exit scope
      againstPosition < against.length && sourcePosition < source.length;
      againstPosition++
    ) {
      let [ current, next ] = this._source.substr( sourcePosition );

      switch ( current ) {
        case '*':
          if ( next == null ) return true;
          else if ( next === against.charAt( againstPosition + 1 ) || next == null ) {
            resumeWildcardAt = [ sourcePosition, againstPosition ];
            sourcePosition++;
          }
          break;
        case '.':
          sourcePosition++;
          break;
        case '\\':
          if ( next === against.charAt( againstPosition ) )
            sourcePosition += 2;
          break;
        default:
          if ( current === against.charAt( againstPosition ) )
            sourcePosition++;
          else if ( resumeWildcardAt )
            [ sourcePosition, againstPosition ] = resumeWildcardAt; 
          else return false;
      }
    }
    
    return sourcePosition === source.length && againstPosition === against.length;
  }

  /**
   * Checks if multiple strings match against the wildcard. Only returns true
   * if all strings match.
   * @param against The strings to compare to the wildcard.
   */
  allMatch( ...against: string[] ): boolean {
    return against.every( each => this.match( each ) ); 
  }

  /**
   * Returns an array of all the strings that matched against the wildcard.
   * @param against The strings to compare to the wildcard.
   */
  findMatches( ...against: string[] ): string[] {
    return against.filter( each => this.match( each ) );
  }

  /**
   * Returns the wildcard string that was used to construct the [[Spirit]].
   */
  toString(): string {
    return this._source;
  }

  /**
   * Provides a way to check if a string matches a wildcard without constructing a [[Spirit]].
   * @param source The wildcard to compare the string against.
   * @param against The string to compare to the wildcard.
   */
  static match( source: Spirit | string, against: string ): boolean {
    return source instanceof Spirit
      ? source.match( against )
      : new Spirit( source ).match( against );
  }

  /**
   * Returns the [[Spirit]] that best matches the target string. In the case of a tie,
   * the spirit that was passed to the function first will be returned.
   * @param target The string the test against the wildcards.
   * @param against The wildcards that will be tested against the string.
   */
  static bestMatch( target: string, ...against: Array<Spirit | string> ): Spirit | null {
    let best = null;

    for ( let each of against ) {
      const spirit = Spirit.createSpirit( each );
      if ( ( !best || spirit.spirit > best.spirit ) && spirit.match( target ) ) best = spirit; 
    }

    return best;
  }
}

// export default class Spirit {
//   constructor( string ) {
//     let invalid = /^[^A-Za-z0-9\?\*\[\]\.\_\-\:]+$/.exec( string )
//     if ( typeof string !== 'string' ) throw garden.typeerror( 'Spirits are made out of strings!')
//     if ( invalid ) throw garden.error( `Invalid character ${invalid[0]} in Spirit!` )

//     let stars = 0
//     this.expression = new RegExp( `^${
//   		string
//   		  .replace( /([\.\[\]])/g, c => `\\${c}` ) // Make sure that special characters are escaped
//   		  .replace( /\*/g, () => ( stars++, '.*' ) ) // Turn * wildcards into RegExp wildcards
//         .replace( /\?/g, '.' ) // If it's anywhere else, the character is required.
//         .replace( /\.$/, '.?' ) // If a ? is at the end of a string, the character is optional
//   	}$` )

//   	this._string = string
//     this.spirit = string.length - stars
//   }

//   static bestMatch( spirits, string ) {
//     if ( !Array.isArray( spirits ) ) throw garden.typeerror( 'Spirit.bestMatch expects an array of Spirits!' )

//     let match = null

//     spirits.forEach( item => {
//       let spirit = item instanceof Spirit ? item : new Spirit( item )
//       if ( spirit.match( string ) ) {
//         if ( !match ) match = spirit
//         else if ( spirit.spirit > match.spirit ) match = spirit
//       }
//     } )

//     return match
//   }

//   static map( spirits, strings ) {
//     if ( !(Array.isArray( spirits ) && Array.isArray( strings )) )
//       throw garden.typeerror( 'Spirit.map expects an array of spirits and an array of strings!' )

//     return new Map(
//       strings.map( string => {
//         return [ string, spirits.filter( spirit =>
//           !!(( spirit instanceof Spirit ? spirit : new Spirit( spirit ) ).match( string ))
//         ) ]
//       })
//     )
//   }
// }
