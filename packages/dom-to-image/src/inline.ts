import { assets } from "./assets.js";
import { formatDataUrl, isDataUrl, joinUrls, splitUrls } from "./urls.js";
import { readBlobAsDataUrl } from "./util.js";

export async function inlineUrls(content: string): Promise<string> {
  const pieces = splitUrls(content);
  for (const piece of pieces) {
    if (typeof piece !== "string") {
      const { url } = piece;
      if (!isDataUrl(url)) {
        const blob = await assets.load(url);
        const { mimeType, encoding, data } = await readBlobAsDataUrl(blob);
        piece.url = formatDataUrl({
          mimeType: assets.getMimeType(url, mimeType),
          encoding,
          data,
        });
      }
    }
  }
  return joinUrls(pieces);
}

export async function inlineImage(element: HTMLImageElement): Promise<void> {
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
