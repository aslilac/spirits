# Spirits
Get the spirit of a string, without the whole thing!

## Usage
```JavaScript
const Spirit = require( 'string-spirits' )

let format = new Spirit( 'The weather is * today!' )
let greeting = 'The weather is great today!'

if ( format.match( greeting ) ) console.log( greeting )
else console.log( 'I have no idea what the weather is like because I am just a computer!' )
```

#### Spirit#match( string )
Returns a boolean indicating if the string has the right spirit!

#### Spirit#allMatches( strings[] )
Returns a filtered array of all the strings that matching

#### Spirit#toString()
Returns the string used to create the spirit.

### Static methods

#### Spirit.match( spirit: string, string )
Useful if you want to safely match, but you may have a string or a spirit. If the first argument
is a string it will be used to create a spirit.

#### Spirit.bestMatch( spirits[], string )
Returns the spirit that best matches the string.

#### Spirit.map( spirits[], strings[] )
Returns a map that links strings to an array of all the spirits that match with them.
