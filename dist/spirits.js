(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('gardens')) :
  typeof define === 'function' && define.amd ? define(['gardens'], factory) :
  (global = global || self, global.Spirit = factory(global.gardens));
}(this, function (gardens) { 'use strict';

  // MIT License / Copyright Kayla Washburn 2014
  const garden = gardens.createScope( 'string-spirits' );

  class Spirit {
    constructor( string ) {
      let invalid = /^[^A-Za-z0-9\?\*\[\]\.\_\-\:]+$/.exec( string );
      if ( typeof string !== 'string' ) throw garden.typeerror( 'Spirits are made out of strings!')
      if ( invalid ) throw garden.error( `Invalid character ${invalid[0]} in Spirit!` )

      let stars = 0;
      this.expression = new RegExp( `^${
  		string
  		  .replace( /([\.\[\]])/g, c => `\\${c}` ) // Make sure that special characters are escaped
  		  .replace( /\*/g, () => ( stars++, '.*' ) ) // Turn * wildcards into RegExp wildcards
        .replace( /\?/g, '.' ) // If it's anywhere else, the character is required.
        .replace( /\.$/, '.?' ) // If a ? is at the end of a string, the character is optional
  	}$` );

    	this._string = string;
      this.spirit = string.length - stars;
    }

    static createSpirit( string ) {
      return new Spirit( string )
    }

    match( string ) {
      if ( typeof string !== 'string' ) throw garden.typeerror( 'Spirits can only match against strings!' )
      return this.expression.exec( string )
    }

    allMatches( strings ) {
      if ( !Array.isArray ) throw garden.typeerror( 'Spirit#allMatches expects an array of strings!' )
      strings.filter( string => !!this.match( string ) );
    }

    toString() {
      return this._string
    }

    static match( spirit, string ) {
      let s = spirit instanceof Spirit ? spirit : new Spirit( spirit );
      return new Spirit( spirit ).match( string )
    }

    static bestMatch( spirits, string ) {
      if ( !Array.isArray( spirits ) ) throw garden.typeerror( 'Spirit.bestMatch expects an array of Spirits!' )

      let match = null;

      spirits.forEach( item => {
        let spirit = item instanceof Spirit ? item : new Spirit( item );
        if ( spirit.match( string ) ) {
          if ( !match ) match = spirit;
          else if ( spirit.spirit > match.spirit ) match = spirit;
        }
      } );

      return match
    }

    static map( spirits, strings ) {
      if ( !(Array.isArray( spirits ) && Array.isArray( strings )) )
        throw garden.typeerror( 'Spirit.map expects an array of spirits and an array of strings!' )

      return new Map(
        strings.map( string => {
          return [ string, spirits.filter( spirit =>
            !!(( spirit instanceof Spirit ? spirit : new Spirit( spirit ) ).match( string ))
          ) ]
        })
      )
    }
  }

  return Spirit;

}));
//# sourceMappingURL=spirits.js.map
