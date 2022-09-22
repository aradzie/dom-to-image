// https://www.rfc-editor.org/rfc/rfc2397
// https://fetch.spec.whatwg.org/#data-urls
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs

export type DataUrl = {
  mimeType: string;
  encoding: "ascii" | "base64";
  data: string;
};

const scheme = "data:";
const base64Enc = ";base64";
const encodeTextData = (data: string): string =>
  data.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\n/g, "%0A");
const decodeTextData = (data: string): string => decodeURIComponent(data);

export const isDataUrl = (url: string): boolean => {
  return url.startsWith(scheme);
};

export const parseDataUrl = (url: string): DataUrl | null => {
  if (!url.startsWith(scheme)) {
    return null;
  }
  const i = url.indexOf(",", scheme.length);
  if (i === -1) {
    return null;
  }
  let prefix = url.substring(scheme.length, i);
  let data = url.substring(i + 1);
  let mimeType: string;
  let encoding: "ascii" | "base64";
  if (prefix.endsWith(base64Enc)) {
    prefix = prefix.substring(0, prefix.length - base64Enc.length);
    encoding = "base64";
  } else {
    encoding = "ascii";
    data = decodeTextData(data);
  }
  if (prefix !== "") {
    mimeType = prefix;
  } else {
    mimeType = "text/plain";
  }
  return {
    mimeType,
    encoding,
    data,
  };
};

export const formatDataUrl = ({
  mimeType = "text/plain",
  encoding = "ascii",
  data,
}: {
  readonly mimeType?: string;
  readonly encoding?: "ascii" | "base64";
  readonly data: string;
}): string => {
  let prefix = scheme;
  if (mimeType != null && mimeType !== "text/plain") {
    prefix += mimeType;
  }
  if (encoding === "base64") {
    prefix += base64Enc;
  } else {
    data = encodeTextData(data);
  }
  return prefix + "," + data;
};
