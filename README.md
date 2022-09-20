# DOM to Image

## What is it

**dom-to-image** is a library which can turn arbitrary DOM node into
a vector (SVG) or raster (PNG or JPEG) image, written in JavaScript. It's
based on [domvas by Paul Bakaus](https://github.com/pbakaus/domvas)
and has been completely rewritten, with some bugs fixed and some new
features (like web font and image support) added.

## Installation

### NPM

`npm install @sosimple/dom-to-image`

## Usage

```javascript
import { captureElementToImage } from "@sosimple/dom-to-image";

captureElementToImage(document.getElementById("my-node"))
  .then((blob) => {
    window.open(URL.createObjectURL(blob), "_blank");
  })
  .catch((error) => {
    console.error(error);
  });
```

### Rendering options

#### filter

A function taking DOM node as argument. Should return true if passed node
should be included in the output (excluding node means excluding its children as well).

#### height, width

Height and width in pixels to be applied to node before rendering.

#### style

An object whose properties to be copied to node's style before rendering.
You might want to check [this reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference)
for JavaScript names of CSS properties.

## How it works

There might some day exist (or maybe already exists?) a simple and standard
way of exporting parts of the HTML to image (and then this script can only
serve as an evidence of all the hoops I had to jump through in order to get
such obvious thing done) but I haven't found one so far.

This library uses a feature of SVG that allows having arbitrary HTML content
inside of the `<foreignObject>` tag. So, in order to render that DOM node
for you, following steps are taken:

1. Clone the original DOM node recursively

2. Compute the style for the node and each sub-node and copy it to
 corresponding clone

 - and don't forget to recreate pseudo-elements, as they are not
  cloned in any way, of course

3. Embed web fonts

 - find all the `@font-face` declarations that might represent web fonts

 - parse file URLs, download corresponding files

 - base64-encode and inline content as `data:` URLs

 - concatenate all the processed CSS rules and put them into one `<style>`
   element, then attach it to the clone

4. Embed images

 - embed image URLs in `<img>` elements

 - inline images used in `background` CSS property, in a fashion similar to
   fonts

5. Serialize the cloned node to XML

6. Wrap XML into the `<foreignObject>` tag, then into the SVG, then make it a
 data URL

7. Optionally, to get PNG content or raw pixel data as a Uint8Array, create an
 Image element with the SVG as a source, and render it on an off-screen
 canvas, that you have also created, then read the content from the canvas

8. Done!

## Things to watch out for

- if the DOM node you want to render includes a `<canvas>` element with
  something drawn on it, it should be handled fine, unless the canvas is
  [tainted](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image) -
  in this case rendering will rather not succeed.

- at the time of writing, Firefox has a problem with some external stylesheets
  (see issue #13). In such case, the error will be caught and logged.

## Authors

Aliaksandr Radzivanovich, Anatolii Saienko, Paul Bakaus (original idea)

## License

MIT
