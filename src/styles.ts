import { inlineUrls } from "./inline.js";
import { containsUrls } from "./urls.js";
import { styleOf } from "./util.js";

export class Styles {
  private classNameIndex = 1;
  private rules: string[] = [];

  private nextClassName(): string {
    return `c${String(this.classNameIndex++).padStart(3, "0")}`;
  }

  async copyStyles(element: Element, clone: Element): Promise<void> {
    clone.removeAttribute("class");
    clone.removeAttribute("style");

    const source = getComputedStyle(element);
    const sourceBefore = getComputedStyle(element, ":before");
    const sourceAfter = getComputedStyle(element, ":after");
    const target = styleOf(clone);

    // Copy non-pseudo element styles.

    for (const [name, value] of styleEntries(source)) {
      target.setProperty(name, await inlineUrls(value));
    }

    // Copy pseudo element styles.

    const beforeContent = sourceBefore.getPropertyValue("content");
    const afterContent = sourceAfter.getPropertyValue("content");
    if (!(beforeContent || afterContent)) {
      return;
    }

    const className = this.nextClassName();
    clone.setAttribute("class", className);
    {
      const properties: [string, string][] = [];
      for (const [name, value] of styleEntries(sourceBefore)) {
        properties.push([name, await inlineUrls(value)]);
      }
      this.rules.push(makeStyleRule(`.${className}:before`, properties));
    }
    {
      const properties: [string, string][] = [];
      for (const [name, value] of styleEntries(sourceAfter)) {
        properties.push([name, await inlineUrls(value)]);
      }
      this.rules.push(makeStyleRule(`.${className}:after`, properties));
    }
  }

  async inlineFonts(): Promise<void> {
    for (const styleSheet of document.styleSheets) {
      for (const cssRule of styleSheet.cssRules) {
        if (
          cssRule instanceof CSSFontFaceRule &&
          containsUrls(cssRule.style.getPropertyValue("src"))
        ) {
          this.rules.push(await inlineUrls(cssRule.cssText));
        }
      }
    }
  }

  getStyleElement(): HTMLStyleElement {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(this.rules.join("\n")));
    return style;
  }
}

function* styleEntries(
  style: CSSStyleDeclaration,
  excludedStyle: CSSStyleDeclaration | null = null,
): Iterable<[string, string]> {
  const { length } = style;
  for (let i = 0; i < length; i++) {
    const name = style.item(i);
    const value = style.getPropertyValue(name);
    if (value !== "") {
      if (
        excludedStyle == null ||
        value !== excludedStyle.getPropertyValue(name)
      ) {
        yield [name, value];
      }
    }
  }
}

const defaultStyle = new Map<string, CSSStyleDeclaration>();

export function getDefaultStyle(
  element: Element,
  pseudoElt: string | null = null,
): CSSStyleDeclaration {
  const key = `${element.tagName}${pseudoElt ?? ""}`;
  let styles = defaultStyle.get(key);
  if (styles == null) {
    const document = new Document();
    const test = document.createElement(element.tagName);
    const body = document.createElement("body");
    body.appendChild(test);
    document.appendChild(body);
    defaultStyle.set(key, (styles = getComputedStyle(test, pseudoElt)));
  }
  return styles;
}

function makeStyleRule(
  selector: string,
  properties: [name: string, value: string][],
): string {
  const body = properties
    .map(([name, value]) => `${name}: ${value};`)
    .join(" ");
  return `${selector} { ${body} }`;
}
