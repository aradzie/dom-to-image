import test from "ava";
import { formatDataUrl, parseDataUrl } from "./dataurl.js";

test("parse", (t) => {
  t.deepEqual(parseDataUrl("data:,"), {
    mimeType: "text/plain",
    encoding: "ascii",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:,abc"), {
    mimeType: "text/plain",
    encoding: "ascii",
    data: "abc",
  });

  // with mime type

  t.deepEqual(parseDataUrl("data:text/html,"), {
    mimeType: "text/html",
    encoding: "ascii",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:text/html,abc"), {
    mimeType: "text/html",
    encoding: "ascii",
    data: "abc",
  });

  // with encoding

  t.deepEqual(parseDataUrl("data:;base64,"), {
    mimeType: "text/plain",
    encoding: "base64",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:;base64,abc"), {
    mimeType: "text/plain",
    encoding: "base64",
    data: "abc",
  });

  // with mime type and encoding

  t.deepEqual(parseDataUrl("data:text/html;base64,"), {
    mimeType: "text/html",
    encoding: "base64",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:text/html;base64,abc"), {
    mimeType: "text/html",
    encoding: "base64",
    data: "abc",
  });
});

test("format", (t) => {
  t.is(
    formatDataUrl({
      data: "",
    }),
    "data:,",
  );
  t.is(
    formatDataUrl({
      data: "abc",
    }),
    "data:,abc",
  );

  // with mimeType

  t.is(
    formatDataUrl({
      mimeType: "text/plain",
      data: "",
    }),
    "data:,",
  );
  t.is(
    formatDataUrl({
      mimeType: "text/plain",
      data: "abc",
    }),
    "data:,abc",
  );
  t.is(
    formatDataUrl({
      mimeType: "text/html",
      data: "",
    }),
    "data:text/html,",
  );
  t.is(
    formatDataUrl({
      mimeType: "text/html",
      data: "abc",
    }),
    "data:text/html,abc",
  );

  // with encoding

  t.is(
    formatDataUrl({
      encoding: "base64",
      data: "",
    }),
    "data:;base64,",
  );
  t.is(
    formatDataUrl({
      encoding: "base64",
      data: "abc",
    }),
    "data:;base64,abc",
  );

  // with mimeType and encoding

  t.is(
    formatDataUrl({
      mimeType: "image/png",
      encoding: "base64",
      data: "",
    }),
    "data:image/png;base64,",
  );
  t.is(
    formatDataUrl({
      mimeType: "image/png",
      encoding: "base64",
      data: "abc",
    }),
    "data:image/png;base64,abc",
  );
});
