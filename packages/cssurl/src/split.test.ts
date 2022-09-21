import test from "ava";
import { joinCssUrls, splitCssUrls } from "./split.js";

test("split urls", (t) => {
  t.deepEqual(splitCssUrls(``), []);
  t.deepEqual(splitCssUrls(`hello`), ["hello"]);
  t.deepEqual(splitCssUrls(`url(./image.png?q=abc#hash)`), [
    { url: "./image.png?q=abc#hash" },
  ]);
  t.deepEqual(
    splitCssUrls(
      `src: ` +
        `url(data:,dummy), ` +
        `url(./image1.png?q=abc#hash), ` +
        `url('./image2.png?q=abc#hash'), ` +
        `url("./image3.png?q=abc#hash");`,
    ),
    [
      "src: ",
      { url: "data:,dummy" },
      ", ",
      { url: "./image1.png?q=abc#hash" },
      ", ",
      { url: "./image2.png?q=abc#hash" },
      ", ",
      { url: "./image3.png?q=abc#hash" },
      ";",
    ],
  );
});

test("join urls", (t) => {
  t.is(joinCssUrls([]), ``);
  t.is(joinCssUrls(["hello"]), `hello`);
  t.is(
    joinCssUrls([
      "src: ",
      { url: "data:,dummy" },
      ", ",
      { url: "./image.png?q=abc#hash" },
      ";",
    ]),
    `src: url(data:,dummy), url(./image.png?q=abc#hash);`,
  );
});
