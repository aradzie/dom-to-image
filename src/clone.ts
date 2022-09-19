import { Styles } from "./styles.js";
import { Options } from "./types.js";
import { makeImage } from "./util.js";

const unsupported = new Set(["IFRAME", "OBJECT", "EMBED", "VIDEO", "AUDIO"]);

export async function cloneElement(
  element: Element,
  options: Options,
  styles: Styles,
): Promise<Element | null> {
  const clone = await shallowCloneElement(element, options);
  if (clone != null) {
    await styles.copyStyles(element, clone);
    await cloneChildren(element, clone, options, styles);
  }
  return clone;
}

async function shallowCloneElement(
  element: Element,
  options: Options,
): Promise<Element | null> {
  const { cloner, filter } = options;
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
  if (element instanceof HTMLCanvasElement) {
    return await makeImage(element.toDataURL());
  }
  return element.cloneNode(false) as Element;
}

async function cloneChildren(
  element: Element,
  clone: Element,
  options: Options,
  styles: Styles,
): Promise<void> {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childClone = await cloneElement(child as Element, options, styles);
      if (childClone != null) {
        clone.appendChild(childClone);
      }
    } else {
      clone.appendChild(child.cloneNode(false));
    }
  }
}
