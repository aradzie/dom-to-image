import { assets } from "./assets.js";
import {
  containsUrls,
  formatDataUrl,
  isDataUrl,
  readUrls,
  urlToRegex,
} from "./urls.js";
import { readBlobAsDataUrl } from "./util.js";

export async function inlineUrls(content: string): Promise<string> {
  const inlineUrl = async (value: string, url: string) => {
    const blob = await assets.load(url);
    const { mimeType, encoding, data } = await readBlobAsDataUrl(blob);
    const dataUrl = formatDataUrl({
      mimeType: assets.getMimeType(url, mimeType),
      encoding,
      data,
    });
    return value.replace(urlToRegex(url), `$1${dataUrl}$3`);
  };
  if (containsUrls(content)) {
    for (const url of readUrls(content)) {
      content = await inlineUrl(content, url);
    }
  }
  return content;
}

export async function inlineImages(element: Element): Promise<void> {
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
