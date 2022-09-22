import { joinCssUrls, splitCssUrls } from "@sosimple/cssurl";
import { assets } from "./assets.js";
import { isDataUrl } from "./dataurl.js";
import { readBlobAsDataUrl } from "./util.js";

export async function inlineUrls(cssText: string): Promise<string> {
  const pieces = splitCssUrls(cssText);
  let updated = false;
  for (const piece of pieces) {
    if (typeof piece !== "string") {
      const { url } = piece;
      if (!isDataUrl(url)) {
        const blob = await assets.load(url);
        const dataUrl = await readBlobAsDataUrl(blob);
        piece.url = dataUrl;
        updated = true;
      }
    }
  }
  return updated ? joinCssUrls(pieces) : cssText;
}

export async function inlineImage(element: HTMLImageElement): Promise<void> {
  const url = element.src;
  if (!isDataUrl(url)) {
    const blob = await assets.load(url);
    const dataUrl = await readBlobAsDataUrl(blob);
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
