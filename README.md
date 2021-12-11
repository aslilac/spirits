# spirits

[![package version](https://img.shields.io/badge/dynamic/json?color=d0d0d0&label=spirits&prefix=v&query=%24%5B%27dist-tags%27%5D.latest&url=https%3A%2F%2Fregistry.npmjs.com%2Fspirits)](https://npmjs.com/package/spirits)
![stability](https://img.shields.io/badge/stability-release-66f29a.svg)
[![main](https://github.com/partheseas/string-spirits/workflows/main/badge.svg)](https://github.com/partheseas/string-spirits/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A nice lightweight wildcard implementation written in TypeScript. I know there are already
a lot of these, but I had a use case that required to test a string against many wildcards
and determine which matched most specifically. I couldn't find one that did that, so
I just made my own. (If you would like that same functionality, look at the `bestMatch`
documentation.)

## Usage

-   [Documentation](https://spirits.vercel.app)

Example:

```JavaScript
import Spirit from "spirits";

const format = new Spirit("The weather is * today!");
const greeting = "The weather is great today!";

console.log(format.match(greeting)
  ? greeting
  : "I have no idea what the weather is like because I am just a computer!");
```
