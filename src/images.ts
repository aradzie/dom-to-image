import { inlineUrls } from "./inliner.js";
import { load } from "./load.js";
import { mime } from "./mime.js";
import { formatDataUrl, isDataUrl } from "./urls.js";
import { readBlobAsDataUrl, styleOf } from "./util.js";

export async function inlineImages(node: Node): Promise<void> {
  if (node instanceof Element) {
    await inlineBackground(node);
    if (node instanceof HTMLImageElement) {
      return await inlineImage(node);
    } else {
      for (const child of node.childNodes) {
        await inlineImages(child);
      }
    }
  }
}

async function inlineBackground(element: Element): Promise<void> {
  const style = styleOf(element);
  for (const name of ["background"]) {
    const value = style.getPropertyValue(name);
    if (value !== "" && value !== "none") {
      style.setProperty(name, await inlineUrls(value, null));
    }
  }
}

async function inlineImage(element: HTMLImageElement): Promise<void> {
  const url = element.src;
  if (!isDataUrl(url)) {
    const blob = await load(url);
    const { mimeType, encoding, data } = await readBlobAsDataUrl(blob);
    const dataUrl = formatDataUrl({
      mimeType: mime.mimeType(url, mimeType),
      encoding,
      data,
    });
    return new Promise((resolve, reject) => {
      element.onload = () => {
        resolve();
      };
      element.onerror = () => {
        reject(new Error(`Cannot load image [${url}].`));
      };
      element.src = dataUrl;
    });
  }
}
