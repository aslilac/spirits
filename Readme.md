# Spirits
Get the spirit of a string, without the whole thing!

A nice lightweight wildcard implementation. I know there are already a lot of these,
but I had a use case that required to test a string against many wildcards and
determine which matched most specifically. I couldn't find one that did that, so
I just made my own. (If you would like that same functionality, look at the `bestMatch`
function below.)

## Installation
```Shell
npm install string-spirits
```
or just download a .zip and throw it into a node_modules folder somewhere.

## Usage
```JavaScript
// CommonJS
const Spirit = require( 'string-spirits' )
// ESModules
import Spirit from 'string-spirits'

let format = new Spirit( 'The weather is * today!' )
let greeting = 'The weather is great today!'

console.log( format.match( greeting )
  ? greeting
  : 'I have no idea what the weather is like because I am just a computer!' )
```

#### Spirit#match( String )
Returns a boolean indicating if the string has the right spirit!

#### Spirit#allMatches( String[] )
Returns a filtered array of all the strings that matching

#### Spirit#toString()
Returns the string used to create the spirit.

### Static methods

#### Spirit.match( Spirit or String, String )
Useful if you want to safely match, but you may have a string or a spirit. If the first argument
is a string it will be used to create a spirit.

#### Spirit.bestMatch( Spirit[], String )
Returns the spirit that best matches the string.

#### Spirit.map( Spirit[], String[] )
Returns a map that links strings to an array of all the spirits that match with them.
