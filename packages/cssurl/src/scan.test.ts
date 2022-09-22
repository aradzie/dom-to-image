import test from "ava";
import { scanCssUrls } from "./scan.js";

test("scanUrls", (t) => {
  t.deepEqual([...scanCssUrls(``)], []);
  t.deepEqual([...scanCssUrls(`   `)], []);
  t.deepEqual([...scanCssUrls(`hello`)], []);
  t.deepEqual([...scanCssUrls(`url`)], []);
  t.deepEqual([...scanCssUrls(`url()`)], []);
  t.deepEqual([...scanCssUrls(`url( )`)], []);
  t.deepEqual([...scanCssUrls(`url('')`)], []);
  t.deepEqual([...scanCssUrls(`url( '' )`)], []);
  t.deepEqual([...scanCssUrls(`url("")`)], []);
  t.deepEqual([...scanCssUrls(`url( "" )`)], []);
  t.deepEqual([...scanCssUrls(`url(image png)`)], []);
  t.deepEqual([...scanCssUrls(`url(image.png`)], []);
  t.deepEqual([...scanCssUrls(`url('image.png`)], []);
  t.deepEqual([...scanCssUrls(`url('image.png'`)], []);
  t.deepEqual([...scanCssUrls(`url("image.png`)], []);
  t.deepEqual([...scanCssUrls(`url("image.png"`)], []);
  t.deepEqual([...scanCssUrls(`url("image.png')`)], []);
  t.deepEqual([...scanCssUrls(`url('image.png")`)], []);
  t.deepEqual([...scanCssUrls(`url('\nimage.png\n')`)], []);
  t.deepEqual([...scanCssUrls(`url (image.png)`)], []);
  t.deepEqual(
    [...scanCssUrls(`url(image.png)`)],
    [{ index: 0, length: 14, url: "image.png" }],
  );
  t.deepEqual(
    [...scanCssUrls(`src:url( image.png ); `)],
    [{ index: 4, length: 16, url: "image.png" }],
  );
  t.deepEqual(
    [...scanCssUrls(`src:url( 'image.png' ); `)],
    [{ index: 4, length: 18, url: "image.png" }],
  );
  t.deepEqual(
    [...scanCssUrls(`src:url( "image.png" ); `)],
    [{ index: 4, length: 18, url: "image.png" }],
  );
  t.deepEqual(
    [...scanCssUrls(`src:url(image1.png),url(image2.png); `)],
    [
      { index: 4, length: 15, url: "image1.png" },
      { index: 20, length: 15, url: "image2.png" },
    ],
  );
  t.deepEqual(
    [...scanCssUrls(`url('image.png' src:url(image1.png),url(image2.png); `)],
    [
      { index: 20, length: 15, url: "image1.png" },
      { index: 36, length: 15, url: "image2.png" },
    ],
  );
});
