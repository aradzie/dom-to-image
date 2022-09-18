import { assets } from "./assets.js";
import {
  containsUrls,
  formatDataUrl,
  readUrls,
  resolveUrl,
  urlToRegex,
} from "./urls.js";
import { readBlobAsDataUrl, styleOf } from "./util.js";

export async function inlineStyleUrls(element: Element): Promise<void> {
  const style = styleOf(element);
  const { length } = style;
  for (let i = 0; i < length; i++) {
    const name = style.item(i);
    const value = style.getPropertyValue(name);
    if (value !== "") {
      style.setProperty(name, await inlineUrls(value));
    }
  }
}

export const inlineUrls = async (
  content: string,
  baseUrl: string | null = null,
): Promise<string> => {
  const inlineUrl = async (content: string, url: string) => {
    const resolvedUrl = baseUrl ? resolveUrl(url, baseUrl) : url;
    const blob = await assets.load(resolvedUrl);
    const { mimeType, encoding, data } = await readBlobAsDataUrl(blob);
    const dataUrl = formatDataUrl({
      mimeType: assets.getMimeType(url, mimeType),
      encoding,
      data,
    });
    return content.replace(urlToRegex(url), `$1${dataUrl}$3`);
  };
  if (containsUrls(content)) {
    for (const url of readUrls(content)) {
      content = await inlineUrl(content, url);
    }
  }
  return content;
};
