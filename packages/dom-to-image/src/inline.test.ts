import test from "ava";
import { assets } from "./assets.js";
import { inlineUrls } from "./inline.js";
import { loadHtml } from "./test/browser-env.js";

test("inline urls", async (t) => {
  // Arrange.

  const cleanup = loadHtml(`<html></html>`);

  (assets as any).load = (url: string): Promise<Blob> => {
    return Promise.resolve(new Blob([url], { type: "image/png" }));
  };

  // Act.

  const inlined = await inlineUrls(
    `.s { background-image: url(data:,dummy); }
    @font-face {
      font-family: "MyWebFont";
      src: url("myfont.woff2") format("woff2"),
           url("myfont.woff") format("woff");
    }`,
  );

  // Assert.

  t.is(
    inlined,
    `.s { background-image: url(data:,dummy); }
    @font-face {
      font-family: "MyWebFont";
      src: url(data:application/font-woff;base64,bXlmb250LndvZmYy) format("woff2"),
           url(data:application/font-woff;base64,bXlmb250LndvZmY=) format("woff");
    }`,
  );

  cleanup();
});
