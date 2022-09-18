import { assets } from "./assets.js";
import { inlineStyleUrls } from "./inliner.js";
import { formatDataUrl, isDataUrl } from "./urls.js";
import { readBlobAsDataUrl } from "./util.js";

export async function inlineImages(element: Element): Promise<void> {
  await inlineStyleUrls(element);
  if (element instanceof HTMLImageElement) {
    return await inlineImage(element);
  } else {
    for (const child of element.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        await inlineImages(child as Element);
      }
    }
  }
}

async function inlineImage(element: HTMLImageElement): Promise<void> {
  const url = element.src;
  if (!isDataUrl(url)) {
    const blob = await assets.load(url);
    const { mimeType, encoding, data } = await readBlobAsDataUrl(blob);
    const dataUrl = formatDataUrl({
      mimeType: assets.getMimeType(url, mimeType),
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
