"use strict";
exports.__esModule = true;
var gardens_1 = require("gardens");
var garden = gardens_1.createScope('string-spirits');
var Spirit = /** @class */ (function () {
    function Spirit(source) {
        var stars = 0;
        this._source = source;
    }
    Spirit.createSpirit = function (source) {
        return new Spirit(source);
    };
    Spirit.prototype.match = function (against) {
        var source = this._source;
        var sourcePosition = 0;
        var againstPosition = 0;
        var resumeWildcardAt = null;
        // let resumeWildcardAt = [
        //   sourcePosition,
        //   againstPosition
        // ];
        for (; // Needs to be initialized above so that it doesn't exit scope
         againstPosition < against.length && sourcePosition < source.length; againstPosition++) {
            var _a = this._source.substr(sourcePosition), current = _a[0], next = _a[1];
            switch (current) {
                case '*':
                    if (next == null)
                        return true;
                    else if (next === against.charAt(againstPosition + 1) || next == null) {
                        resumeWildcardAt = [sourcePosition, againstPosition];
                        sourcePosition++;
                    }
                    break;
                case '.':
                    sourcePosition++;
                    break;
                case '\\':
                    if (next === against.charAt(againstPosition))
                        sourcePosition += 2;
                    break;
                default:
                    if (current === against.charAt(againstPosition))
                        sourcePosition++;
                    else if (resumeWildcardAt) {
                        sourcePosition = resumeWildcardAt[0], againstPosition = resumeWildcardAt[1];
                        // console.log('successfully resumed', resumeWildcardAt);
                    }
                    else
                        return false;
            }
        }
        var matched = sourcePosition === source.length && againstPosition === against.length;
        // console.log( `${source} matches ${against}: ${matched}` );
        return matched;
    };
    Spirit.prototype.allMatch = function () {
        var _this = this;
        var against = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            against[_i] = arguments[_i];
        }
        return against.every(function (each) { return _this.match(each); });
    };
    Spirit.prototype.toString = function () {
        return this._source;
    };
    Spirit.match = function (source, against) {
        return source instanceof Spirit
            ? source.match(against)
            : new Spirit(source).match(against);
    };
    return Spirit;
}());
exports["default"] = Spirit;
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
