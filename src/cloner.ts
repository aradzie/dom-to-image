import { inlineImage, inlineUrls } from "./inline.js";
import { Options } from "./types.js";
import { containsUrls } from "./urls.js";
import { makeImage } from "./util.js";

const unsupported = new Set(["IFRAME", "OBJECT", "EMBED", "VIDEO", "AUDIO"]);

export class Cloner {
  /** The mapping from elements to their clones */
  private readonly mapping: (readonly [Element, Element])[] = [];
  /** Contains the created CSS font and style rules. */
  private readonly rules: string[] = [];
  /** For computing CSS class names of the created CSS style rules.  */
  private classNameIndex = 0;

  constructor(readonly options: Options) {}

  async cloneElement(element: Element): Promise<Element | null> {
    const { cloner, filter } = this.options;
    if (cloner != null) {
      const clone = await cloner(element);
      if (clone != null) {
        return clone;
      }
    }
    if (filter != null && !filter(element)) {
      return null;
    }
    if (unsupported.has(element.nodeName)) {
      return null;
    }
    const clone = await this.shallowCloneElement(element);
    this.mapping.push([element, clone]);
    clone.removeAttribute("class");
    clone.removeAttribute("style");
    const { style } = clone as HTMLElement;
    style.all = "revert";
    await this.cloneChildren(element, clone);
    return clone;
  }

  private async shallowCloneElement(element: Element): Promise<Element> {
    if (element instanceof HTMLCanvasElement) {
      return await makeImage(element.toDataURL());
    } else {
      const clone = element.cloneNode(false) as Element;
      if (clone instanceof HTMLImageElement) {
        await inlineImage(clone);
      }
      return clone;
    }
  }

  private async cloneChildren(element: Element, clone: Element): Promise<void> {
    for (const child of element.childNodes) {
      if (child instanceof Element) {
        const childClone = await this.cloneElement(child);
        if (childClone != null) {
          clone.appendChild(childClone);
        }
      } else {
        clone.appendChild(child.cloneNode(false));
      }
    }
  }

  async copyStyles(): Promise<void> {
    for (const [element, clone] of this.mapping) {
      await this.copyElementStyles(element, clone);
      await this.copyPseudoElementStyles(element, clone, ":before");
      await this.copyPseudoElementStyles(element, clone, ":after");
    }
  }

  private async copyElementStyles(
    element: Element,
    clone: Element,
  ): Promise<void> {
    const source = getComputedStyle(element);
    const excluded = getComputedStyle(clone); // Default values.
    const { style } = clone as HTMLElement;
    for (const [name, value] of await inlineStyles(source, excluded)) {
      style.setProperty(name, value);
    }
  }

  private async copyPseudoElementStyles(
    element: Element,
    clone: Element,
    pseudo: string,
  ): Promise<void> {
    const source = getComputedStyle(element, pseudo);
    if (source.getPropertyValue("content") !== "none") {
      const excluded = getComputedStyle(clone, pseudo); // Default values.
      const className = this.nextClassName();
      const selector = `.${className}${pseudo}`;
      const properties = await inlineStyles(source, excluded);
      clone.classList.add(className);
      this.rules.push(makeStyleRule(selector, properties));
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

  getStyleText(): string {
    return this.rules.join("\n");
  }

  private nextClassName(): string {
    return `c${String(this.classNameIndex++).padStart(3, "0")}`;
  }
}

type StyleProperty = readonly [name: string, value: string];

async function inlineStyles(
  style: CSSStyleDeclaration,
  excludedStyle: CSSStyleDeclaration | null = null,
): Promise<StyleProperty[]> {
  const properties: StyleProperty[] = [];
  const { length } = style;
  for (let i = 0; i < length; i++) {
    const name = style.item(i);
    const value = style.getPropertyValue(name);
    if (!name.startsWith("--")) {
      if (
        excludedStyle == null ||
        value !== excludedStyle.getPropertyValue(name)
      ) {
        properties.push([name, await inlineUrls(value)]);
      }
    }
  }
  return properties;
}

function makeStyleRule(selector: string, properties: StyleProperty[]): string {
  const body = properties
    .map(([name, value]) => `${name}: ${value};`)
    .join(" ");
  return `${selector} { ${body} }`;
}
