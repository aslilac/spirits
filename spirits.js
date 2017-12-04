// MIT License / Copyright 2014

'use strict'

let garden = require( 'gardens' ).auto( __filename )

module.exports = class Spirit {
  constructor( string ) {
    if ( typeof string !== 'string' ) throw new TypeError( 'Spirits are made out of strings!')
    if ( !/^[A-Za-z0-9\*\[\]\.\_\-\:]+$/.test( string ) ) throw new Error( 'Invalid character in Spirit!' )

    let stars = 0
    this.expression = new RegExp( `^${
  		string
  		  .replace( /([\.\[\]])/g, c => `\\${c}` ) // Make sure that special characters are escaped
  		  .replace( /\*/g, ( stars++, '.*' ) ) // Turn * wildcards into RegExp wildcards
        .replace( /\?$/, '.?' ) // If a ? is at the end of a string, the character is optional
        .replace( /\?/g, '.' ) // If it's anywhere else, the character is required.
  	}$` )

  	this._string = string
    this.spirit = string.length - stars
  }

  match( string ) {
    return this.expression.exec( string )
  }

  toString() {
    return this._string
  }

  static match( spirit, string ) {
    return new Spirit( spirit ).match( string )
  }

  static bestMatch( string, cards ) {
    let match = ""

    cards.forEach( card => {
      let s = card instanceof Spirit ? card : new Spirit( card )
      if ( s.match( string ) && s.spirit > match.length ) match = s
    } )

    return match
  }

  static createSpirit( string ) {
    return new Spirit( string )
  }
}
