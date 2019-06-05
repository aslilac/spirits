# string-spirits
![package version](https://img.shields.io/badge/dynamic/json.svg?color=d7d7d7&label=string-spirits&query=%24.version&url=https%3A%2F%2Funpkg.io%2Fstring-spirits%2Fpackage.json&prefix=v)
![stability](https://img.shields.io/badge/stability-release-66f29a.svg)

A nice lightweight wildcard implementation. I know there are already a lot of these,
but I had a use case that required to test a string against many wildcards and
determine which matched most specifically. I couldn't find one that did that, so
I just made my own. (If you would like that same functionality, look at the `bestMatch`
function below.)

## Installation
```Shell
yarn add string-spirits
```
You should use Yarn and [pnp](https://yarnpkg.com/en/docs/pnp).

## Usage
```JavaScript
import Spirit from 'string-spirits'

let format = new Spirit( 'The weather is * today!' )
let greeting = 'The weather is great today!'

console.log( format.match( greeting )
  ? greeting
  : 'I have no idea what the weather is like because I am just a computer!' )
```

### Instance methods

#### match( string ) &rarr; boolean
Returns either a match array or null

#### allMatches( string[] ) &rarr; string[]
Returns a filtered array of all the strings that match the spirit

#### toString() &rarr; string
Returns the string used to create the spirit.

### Static methods

#### match( Spirit or string, string ) &rarr;
Returns either a match array or null. Useful if you may have a string or a spirit.
If the first argument is a string it will be used to create a spirit.

#### bestMatch( Spirit[], string ) &rarr; Spirit
Returns the `Spirit` that best matches the string.

#### map( Spirit[], string[] )
Returns a map that links strings to an array of all the spirits that match with them.
