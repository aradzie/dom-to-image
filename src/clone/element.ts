import { Options } from "../types.js";
import { uid } from "../uid.js";
import { makeImage } from "../util.js";
import { postprocess } from "./fix.js";
import { copyStyles, getStyles, Pseudo } from "./styles.js";

const unsupported = new Set(["IFRAME", "OBJECT", "EMBED", "VIDEO", "AUDIO"]);

export async function cloneElement(
  element: Element,
  options: Options,
): Promise<Element | null> {
  const clone = await shallowCloneElement(element, options);
  if (clone != null) {
    clonePseudoElement(element, clone, ":before");
    clonePseudoElement(element, clone, ":after");
    await cloneChildren(element, clone, options);
    copyStyles(element, clone);
    postprocess(element, clone);
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
): Promise<void> {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childClone = await cloneElement(child as Element, options);
      if (childClone != null) {
        clone.appendChild(childClone);
      }
    } else {
      clone.appendChild(child.cloneNode(false));
    }
  }
}

function clonePseudoElement(
  element: Element,
  clone: Element,
  pseudo: Pseudo,
): void {
  const styles = getStyles(element, pseudo);
  if ((styles.get("content") ?? "") === "") {
    return;
  }
  const className = uid();
  clone.classList.add(className);
  const cssProps = [...styles.entries()]
    .map(([name, value]) => `${name}:${value}`)
    .join("; ");
  const cssText = `.${className}${pseudo} { ${cssProps} }`;
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(cssText));
  clone.appendChild(style);
}
