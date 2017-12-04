# Spirits
Get the spirit of strings without needing the whole string!

## Usage
```JavaScript
const Spirit = require( 'string-spirits' )

let format = new Spirit( 'The weather is * today!' )
let greeting = 'The weather is great today!'

if ( format.match( greeting ) ) console.log( greeting )
else console.log( 'I have no idea what the weather is like because I am just a computer!' )
```

### But..but that's not very wild at all..
I know. I might make it better later.
