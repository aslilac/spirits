# spirits

> Get the spirit of a string, without the whole thing!

A glob/wildcard matching library.

I know there are already a lot of these, but I had a use case that required testing a string against many wildcards and determining which matched most specifically. I couldn't find one that did that, so I just made my own. (If you would like that same functionality, look for the `bestMatch` function.)

## Usage

```javascript
import Spirit from "spirits";

const format = new Spirit("The weather is * today!");
const greeting = "The weather is great today!";

console.log(
	format.match(greeting)
		? greeting
		: "I have no idea what the weather is like because I am just a computer!",
);
```
