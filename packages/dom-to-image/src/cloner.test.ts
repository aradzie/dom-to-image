import test from "ava";
import { Cloner } from "./cloner.js";
import { loadHtml } from "./test/browser-env.js";

test.serial("clone", async (t) => {
  // Arrange.

  const cleanup = loadHtml(`
    <html>
      <div id="root" class="root"><span>hello</span></div>
    </html>`);
  const element = document.querySelector("#root") as Element;
  const cloner = new Cloner({});

  // Act.

  const clone = (await cloner.cloneElement(element)) as Element;
  await cloner.inlineFonts();
  await cloner.copyStyles();

  // Assert.

  t.not(clone, element);
  t.is(clone.tagName, "DIV");
  t.is(clone.textContent, "hello");

  cleanup();
});

test.serial("clone with filter on root", async (t) => {
  // Arrange.

  const cleanup = loadHtml(`
    <html>
      <div id="root" class="root">[<span>hello</span>]</div>
    </html>`);
  const element = document.querySelector("#root") as Element;
  const cloner = new Cloner({
    filter: (element) => false,
  });

  // Act.

  const clone = await cloner.cloneElement(element);

  // Assert.

  t.is(clone, null);

  cleanup();
});

test.serial("clone with filter", async (t) => {
  // Arrange.

  const cleanup = loadHtml(`
    <html>
      <div id="root" class="root">[<span>hello</span>]</div>
    </html>`);
  const element = document.querySelector("#root") as Element;
  const cloner = new Cloner({
    filter: (element) => element.tagName !== "SPAN",
  });

  // Act.

  const clone = (await cloner.cloneElement(element)) as Element;
  await cloner.inlineFonts();
  await cloner.copyStyles();

  // Assert.

  t.not(clone, element);
  t.is(clone.tagName, "DIV");
  t.is(clone.textContent, "[]");

  cleanup();
});

test.serial("clone with replacer on root", async (t) => {
  // Arrange.

  const cleanup = loadHtml(`
    <html>
      <div id="root" class="root">[<span>hello</span>]</div>
    </html>`);
  const element = document.querySelector("#root") as Element;
  const cloner = new Cloner({
    replacer: (element) => {
      const clone = document.createElement("strong");
      clone.textContent = "replaced";
      return Promise.resolve(clone);
    },
  });

  // Act.

  const clone = (await cloner.cloneElement(element)) as Element;
  await cloner.inlineFonts();
  await cloner.copyStyles();

  // Assert.

  t.not(clone, element);
  t.is(clone.tagName, "STRONG");
  t.is(clone.textContent, "replaced");

  cleanup();
});

test.serial("clone with replacer", async (t) => {
  // Arrange.

  const cleanup = loadHtml(`
    <html>
      <div id="root" class="root">[<span>hello</span>]</div>
    </html>`);
  const element = document.querySelector("#root") as Element;
  const cloner = new Cloner({
    replacer: (element) => {
      if (element.tagName === "SPAN") {
        const clone = document.createElement("strong");
        clone.textContent = "replaced";
        return Promise.resolve(clone);
      } else {
        return Promise.resolve(null);
      }
    },
  });

  // Act.

  const clone = (await cloner.cloneElement(element)) as Element;
  await cloner.inlineFonts();
  await cloner.copyStyles();

  // Assert.

  t.not(clone, element);
  t.is(clone.tagName, "DIV");
  t.is(clone.textContent, "[replaced]");

  cleanup();
});
