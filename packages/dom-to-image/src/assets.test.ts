import test from "ava";
import { assets } from "./assets.js";

test("path extension", (t) => {
  t.is(assets.parsePathExt("/path"), "");
  t.is(assets.parsePathExt("/path?a=1#hash"), "");
  t.is(assets.parsePathExt("/path.TXT"), "txt");
  t.is(assets.parsePathExt("/path.png"), "png");
  t.is(assets.parsePathExt("/path.TXT?a=1#hash"), "txt");
  t.is(assets.parsePathExt("/path.png?a=1#hash"), "png");
});

test("mime type of url", (t) => {
  t.is(assets.getMimeType("/path.PNG"), "image/png");
  t.is(assets.getMimeType("/path.JPG"), "image/jpeg");
  t.is(assets.getMimeType("/path.JPEG"), "image/jpeg");
});

test("unknown mime type of url", (t) => {
  t.is(assets.getMimeType("/path"), "application/octet-stream");
  t.is(assets.getMimeType("/path", "text/plain"), "text/plain");
  t.is(assets.getMimeType("/path.omg"), "application/octet-stream");
  t.is(assets.getMimeType("/path.omg", "text/plain"), "text/plain");
});
