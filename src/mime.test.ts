import test from "ava";
import { mime } from "./mime.js";

test("ext", (t) => {
  t.is(mime.fileExt("/path"), "");
  t.is(mime.fileExt("/path?a=1#hash"), "");
  t.is(mime.fileExt("/path.TXT"), "txt");
  t.is(mime.fileExt("/path.png"), "png");
  t.is(mime.fileExt("/path.TXT?a=1#hash"), "txt");
  t.is(mime.fileExt("/path.png?a=1#hash"), "png");
});

test("mime", (t) => {
  t.is(mime.mimeType("/path.PNG"), "image/png");
  t.is(mime.mimeType("/path.JPG"), "image/jpeg");
  t.is(mime.mimeType("/path.JPEG"), "image/jpeg");
});

test("unknown mime", (t) => {
  t.is(mime.mimeType("/path"), "application/octet-stream");
  t.is(mime.mimeType("/path", "text/plain"), "text/plain");
  t.is(mime.mimeType("/path.omg"), "application/octet-stream");
  t.is(mime.mimeType("/path.omg", "text/plain"), "text/plain");
});
