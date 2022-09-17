import { styleOf } from "../util.js";

type ElementStyles = Map</* name */ string, /* value*/ string>;

const getStyles = (element: Element): ElementStyles => {
  const map = new Map<string, string>();
  const style = getComputedStyle(element);
  const { length } = style;
  for (let i = 0; i < length; i++) {
    const name = style.item(i);
    map.set(name, style.getPropertyValue(name));
  }
  return map;
};

const defaultStyles = new Map</* tag */ string, ElementStyles>();

const getDefaultStyles = ({ tagName }: Element): ElementStyles => {
  let styles = defaultStyles.get(tagName);
  if (styles == null) {
    const document = new Document();
    const element = document.createElement(tagName);
    document.appendChild(element);
    defaultStyles.set(tagName, (styles = getStyles(element)));
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
