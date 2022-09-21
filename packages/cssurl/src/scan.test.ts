import test from "ava";
import { scanUrls } from "./scan.js";

test("scanUrls", (t) => {
  t.deepEqual([...scanUrls(``)], []);
  t.deepEqual([...scanUrls(`   `)], []);
  t.deepEqual([...scanUrls(`hello`)], []);
  t.deepEqual([...scanUrls(`url`)], []);
  t.deepEqual([...scanUrls(`url()`)], []);
  t.deepEqual([...scanUrls(`url ( )`)], []);
  t.deepEqual([...scanUrls(`url('')`)], []);
  t.deepEqual([...scanUrls(`url( '' )`)], []);
  t.deepEqual([...scanUrls(`url("")`)], []);
  t.deepEqual([...scanUrls(`url( "" )`)], []);
  t.deepEqual([...scanUrls(`url(image.png`)], []);
  t.deepEqual([...scanUrls(`url('image.png`)], []);
  t.deepEqual([...scanUrls(`url('image.png'`)], []);
  t.deepEqual([...scanUrls(`url("image.png`)], []);
  t.deepEqual([...scanUrls(`url("image.png"`)], []);
  t.deepEqual([...scanUrls(`url("image.png')`)], []);
  t.deepEqual([...scanUrls(`url('image.png")`)], []);
  t.deepEqual([...scanUrls(`url( a b c )`)], [{ index: 5, url: "a b c" }]);
  t.deepEqual(
    [...scanUrls(`url(image.png)`)],
    [{ index: 4, url: "image.png" }],
  );
  t.deepEqual(
    [...scanUrls(`src:url ( image.png ); `)],
    [{ index: 10, url: "image.png" }],
  );
  t.deepEqual(
    [...scanUrls(`src:url ( 'image.png' ); `)],
    [{ index: 11, url: "image.png" }],
  );
  t.deepEqual(
    [...scanUrls(`src:url ( "image.png" ); `)],
    [{ index: 11, url: "image.png" }],
  );
  t.deepEqual(
    [...scanUrls(`src:url(image1.png),url(image2.png); `)],
    [
      { index: 8, url: "image1.png" },
      { index: 24, url: "image2.png" },
    ],
  );
  t.deepEqual(
    [...scanUrls(`url('image.png' src:url(image1.png),url(image2.png); `)],
    [
      { index: 24, url: "image1.png" },
      { index: 40, url: "image2.png" },
    ],
  );
});
