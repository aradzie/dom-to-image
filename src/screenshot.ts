import { Options } from "./types.js";

export const takeScreenshotAsync = (
  selector: Element | string,
  options: Options = {},
): Promise<Blob> => {
  let element: Element;
  if (typeof selector === "string") {
    const found = document.querySelector<Element>(selector);
    if (found == null) {
      return Promise.reject(new Error(`Element [${selector}] not found.`));
    }
    element = found;
  } else {
    element = selector;
  }
  return import("./canvas.js").then(({ toBlob }) => toBlob(element, options));
};
