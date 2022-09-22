import { joinCssUrls, splitCssUrls } from "@sosimple/cssurl";
import { assets } from "./assets.js";
import { formatDataUrl, isDataUrl, parseDataUrl } from "./dataurl.js";
import { readBlobAsDataUrl } from "./util.js";

export async function inlineUrls(cssText: string): Promise<string> {
  const pieces = splitCssUrls(cssText);
  let updated = false;
  for (const piece of pieces) {
    if (typeof piece !== "string") {
      const { url } = piece;
      if (!isDataUrl(url)) {
        const blob = await assets.load(url);
        piece.url = await fixMimeType(url, blob);
        updated = true;
      }
    }
  }
  return updated ? joinCssUrls(pieces) : cssText;
}

export async function inlineImage(element: HTMLImageElement): Promise<void> {
  let url = element.src;
  if (!isDataUrl(url)) {
    const blob = await assets.load(url);
    url = await fixMimeType(url, blob);
    return new Promise((resolve, reject) => {
      element.onload = () => {
        resolve();
      };
      element.onerror = () => {
        reject(new Error(`Cannot load image [${url}].`));
      };
      element.src = url;
    });
  }
}

async function fixMimeType(url: string, blob: Blob): Promise<string> {
  const dataUrl = await readBlobAsDataUrl(blob);
  const { mimeType, encoding, data } = parseDataUrl(dataUrl);
  return formatDataUrl({
    mimeType: assets.getMimeType(url, mimeType),
    encoding,
    data,
  });
}
