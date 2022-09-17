import { load } from "./load.js";
import { mime } from "./mime.js";
import {
  containsUrls,
  formatDataUrl,
  readUrls,
  resolveUrl,
  urlToRegex,
} from "./urls.js";
import { readBlobAsDataUrl } from "./util.js";

export const inlineUrls = async (
  content: string,
  baseUrl: string | null,
): Promise<string> => {
  const inlineUrl = async (content: string, url: string) => {
    const resolvedUrl = baseUrl ? resolveUrl(url, baseUrl) : url;
    const blob = await load(resolvedUrl);
    const { mimeType, encoding, data } = await readBlobAsDataUrl(blob);
    const dataUrl = formatDataUrl({
      mimeType: mime.mimeType(url, mimeType),
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
