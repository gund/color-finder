# color-finder [![Build Status](https://travis-ci.org/gund/color-finder.svg?branch=master)](https://travis-ci.org/gund/color-finder)  [![Coverage Status](https://coveralls.io/repos/gund/color-finder/badge.svg?branch=master&service=github)](https://coveralls.io/github/gund/color-finder?branch=master)

This class can get you a common color from the image by url.
But be careful of ussing this as there are Cross Origin policy which may block some images from different domains.

Live Demo: http://preview.16mb.com/color-finder/

## Installation

**Using bower:**

`bower install color-finder --save`

**Using npm:**

`npm install color-finder`

or just download latest release from Github.

## Usage

`ColorFinder.fromImage('http://....jpg', function(color) {...})`

**color** is an array which contains RGB value (ex. [234, 48, 255]).

### Additional Configuration

You can specify maximum value for RGB complement by calling:

`ColorFinder.setConfig('maxColorValue', 230)` *type:Number* [230 by default]

Here **230** will be limit for every color complement (R < 230, G < 230, B < 230).

`ColorFinder.setConfig('quality', 10)` *type:Number* [10 by default]

**quality** will affect amount of pixels being processed to determine common color.
This value may affect performance.

`ColorFinder.setConfig('colorsAmount', 10)` *type:Number* [10 by default]

**colorsAmount** also affects the quality of final color but in later stage of quantization process.
This value does not affect performance ( if colorsAmount is in good range (= ).

`ColorFinder.setConfig('useWebWorker', true)` *type:Boolean* [true by default]

**useWebWorker** will perform all heavy calculations in Web Worker thread if available in browser

`ColorFinder.setConfig('workerPrefixPath', "")` *type:String* ["" (empty string) by default]

**workerPrefixPath** will be added to the url path to web worker.
In case you have different url path - you can use this value to make worker work.

## Development

To build this package run `gulp`

To run tests run `npm test`

## Known Issues

- You may face an issue when a callback function did not invoke at all.  
Most probably the web worker is not loaded properly (you can verify that by checking browser and server requests log).
If that is a problem - correct path to web worker by setting `ColorFinder.setConfig('workerPrefixPath', "your/path/")`
to right url prefix.

### Credits

- Nick Rabinowitz – Thanks for the modified median cut quantization JS port (http://www.leptonica.com)

#### Author
**Alex Malkevich**
