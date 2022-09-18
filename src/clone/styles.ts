import { styleOf } from "../util.js";

export type StyleProperties = Map<string, string>;

export type Pseudo = ":before" | ":after";

export const readStyles = (style: CSSStyleDeclaration): StyleProperties => {
  const map = new Map<string, string>();
  const { length } = style;
  for (let i = 0; i < length; i++) {
    const name = style.item(i);
    map.set(name, style.getPropertyValue(name));
  }
  return map;
};

export const getStyles = (
  element: Element,
  pseudoElt: Pseudo | null = null,
): StyleProperties => {
  return readStyles(getComputedStyle(element, pseudoElt));
};

const defaultStyles = new Map<string, StyleProperties>();

export const getDefaultStyles = (
  element: Element,
  pseudoElt: Pseudo | null = null,
): StyleProperties => {
  const key = `${element.tagName}${pseudoElt ?? ""}`;
  let styles = defaultStyles.get(key);
  if (styles == null) {
    const document = new Document();
    const element = document.createElement(key);
    document.appendChild(element);
    defaultStyles.set(key, (styles = getStyles(element, pseudoElt)));
  }
  return styles;
};

export const copyStyles = (element: Element, clone: Element): void => {
  clone.removeAttribute("class");
  clone.removeAttribute("style");
  const defaultStyles = getDefaultStyles(element);
  const styles = getStyles(element);
  const target = styleOf(clone);
  for (const [name, value] of styles) {
    if (value !== defaultStyles.get(name)) {
      target.setProperty(name, value);
    }
  }
};
