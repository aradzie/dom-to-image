import { Cloner, Filter } from "../types.js";
import { uid } from "../uid.js";
import { makeImage } from "../util.js";
import { postprocess } from "./fix.js";
import { copyStyles } from "./styles.js";

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
    await cloneChildren(element, clone, context);
    if (element.nodeType === Node.ELEMENT_NODE) {
      for (const pseudo of [":before", ":after"]) {
        clonePseudoElement(element, clone, pseudo);
      }
      copyStyles(element, clone);
      postprocess(element, clone);
    }
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
  pseudo: string,
): void {
  const style = getComputedStyle(element, pseudo);
  const content = style.getPropertyValue("content");

  if (content === "" || content === "none") {
    return;
  }

  const className = uid();
  const currentClass = clone.getAttribute("class");
  if (currentClass) {
    clone.setAttribute("class", `${currentClass} ${className}`);
  }

  const formatPseudoElementStyle = (): Text => {
    const formatCssText = () => {
      return `${style.cssText} content: ${style.getPropertyValue("content")}`;
    };

    const formatCssProperties = () => {
      return [...style]
        .map((name: string): string => {
          const value = style.getPropertyValue(name);
          const priority = style.getPropertyPriority(name);
          return `${name}: ${value} ${priority}`;
        })
        .join("; ");
    };

    const cssText = style.cssText ? formatCssText() : formatCssProperties();
    return document.createTextNode(`.${className}:${pseudo} { ${cssText} }`);
  };

  const styleElement = document.createElement("style");
  styleElement.appendChild(formatPseudoElementStyle());
  clone.appendChild(styleElement);
}
