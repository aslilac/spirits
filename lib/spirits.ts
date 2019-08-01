export default class Spirit {
  // The string used to create the Spirit.
  _source: string;
  // Represents how specific the Spirit is.
  spirit: number;

  constructor( source: string ) {
    this._source = source;
  }

  static createSpirit( source: string ): Spirit {
    return new Spirit( source );
  }

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

    const matched = sourcePosition === source.length && againstPosition === against.length
    
    // console.log( `${source} matches ${against}: ${matched}` );
    
    return matched;
  }

  allMatch( ...against: string[] ): boolean {
    return against.every( each => this.match( each ) ); 
  }

  toString(): string {
    return this._source;
  }

  static match( source: Spirit | string, against: string ): boolean {
    return source instanceof Spirit
      ? source.match( against )
      : new Spirit( source ).match( against );
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
