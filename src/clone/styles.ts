import { inlineUrls } from "../inliner.js";
import { styleOf } from "../util.js";

const defaultStyle = new Map<string, CSSStyleDeclaration>();

function getDefaultStyle(
  element: Element,
  pseudoElt: string | null = null,
): CSSStyleDeclaration {
  const key = `${element.tagName}${pseudoElt ?? ""}`;
  let styles = defaultStyle.get(key);
  if (styles == null) {
    const document = new Document();
    const element = document.createElement(key);
    document.appendChild(element);
    defaultStyle.set(key, (styles = getComputedStyle(element, pseudoElt)));
  }
  return styles;
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
      if (excludedStyle != null) {
        const excludedValue = excludedStyle.getPropertyValue(name);
        if (value !== excludedValue) {
          yield [name, value];
          continue;
        }
      }
      yield [name, value];
    }
  }
}

type Property = [name: string, value: string];

type Rule = [selector: string, properties: Property[]];

export class Styles {
  private classNameIndex = 1;
  private rules: Rule[] = [];

  private nextClassName(): string {
    return `c${String(this.classNameIndex++).padStart(3, "0")}`;
  }

  getCssText(): string {
    let css = "";
    for (const [selector, properties] of this.rules) {
      const values = properties.map(([name, value]) => `${name}: ${value}`);
      css += `${selector} { ${values.join("; ")} }\n`;
    }
    return css;
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
    if (beforeContent || afterContent) {
      const className = this.nextClassName();
      clone.classList.add(className);
      {
        const properties: Property[] = [];
        for (const [name, value] of styleEntries(sourceBefore)) {
          properties.push([name, await inlineUrls(value)]);
        }
        this.rules.push([`.${className}:before`, properties]);
      }
      {
        const properties: Property[] = [];
        for (const [name, value] of styleEntries(sourceAfter)) {
          properties.push([name, await inlineUrls(value)]);
        }
        this.rules.push([`.${className}:after`, properties]);
      }
    }
  }

  finish(clone: Element): void {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(this.getCssText()));
    clone.appendChild(style);
  }
}
