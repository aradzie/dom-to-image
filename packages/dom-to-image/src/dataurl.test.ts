import test from "ava";
import { formatDataUrl, parseDataUrl } from "./dataurl.js";

test("parse", (t) => {
  t.deepEqual(parseDataUrl("data:,"), {
    mimeType: "text/plain",
    encoding: "ascii",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:,%20abc%20"), {
    mimeType: "text/plain",
    encoding: "ascii",
    data: " abc ",
  });

  // with mime type

  t.deepEqual(parseDataUrl("data:text/html,"), {
    mimeType: "text/html",
    encoding: "ascii",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:text/html,%20abc%20"), {
    mimeType: "text/html",
    encoding: "ascii",
    data: " abc ",
  });

  // with encoding

  t.deepEqual(parseDataUrl("data:;base64,"), {
    mimeType: "text/plain",
    encoding: "base64",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:;base64,YWJj"), {
    mimeType: "text/plain",
    encoding: "base64",
    data: "YWJj",
  });

  // with mime type and encoding

  t.deepEqual(parseDataUrl("data:text/html;base64,"), {
    mimeType: "text/html",
    encoding: "base64",
    data: "",
  });
  t.deepEqual(parseDataUrl("data:text/html;base64,YWJj"), {
    mimeType: "text/html",
    encoding: "base64",
    data: "YWJj",
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
      data: "%abc%",
    }),
    "data:,%25abc%25",
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
      data: "%abc%",
    }),
    "data:,%25abc%25",
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
      data: "%abc%",
    }),
    "data:text/html,%25abc%25",
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
      data: "YWJj",
    }),
    "data:;base64,YWJj",
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
      data: "YWJj",
    }),
    "data:image/png;base64,YWJj",
  );
});

test("format then parse", (t) => {
  const data = " \n~!@#$%^&*()_+ data";
  t.deepEqual(parseDataUrl(formatDataUrl({ data })), {
    mimeType: "text/plain",
    encoding: "ascii",
    data,
  });
});
