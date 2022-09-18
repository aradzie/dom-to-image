import { Cloner, Filter } from "../types.js";
import { uid } from "../uid.js";
import { makeImage } from "../util.js";
import { postprocess } from "./fix.js";
import { copyStyles, getStyles, Pseudo } from "./styles.js";

const unsupported = new Set(["IFRAME", "OBJECT", "EMBED", "VIDEO", "AUDIO"]);

type Context = {
  readonly cloner: Cloner | null;
  readonly filter: Filter | null;
};

export async function cloneElement(
  element: Element,
  context: Context,
): Promise<Element | null> {
  const clone = await shallowCloneElement(element, context);
  if (clone != null) {
    clonePseudoElement(element, clone, ":before");
    clonePseudoElement(element, clone, ":after");
    await cloneChildren(element, clone, context);
    copyStyles(element, clone);
    postprocess(element, clone);
  }
  return clone;
}

async function shallowCloneElement(
  element: Element,
  context: Context,
): Promise<Element | null> {
  const { cloner, filter } = context;
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
  context: Context,
): Promise<void> {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childClone = await cloneElement(child as Element, context);
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
