export type DataUrl = {
  mimeType: string | "text/plain";
  encoding: "ascii" | "base64";
  data: string;
};

export const isDataUrl = (url: string): boolean => {
  return url.startsWith("data:");
};

export const parseDataUrl = (url: string): DataUrl => {
  if (!isDataUrl(url)) {
    throw new Error();
  }
  const i = url.indexOf(",");
  if (i === -1) {
    throw new Error();
  }
  const data = url.substring(i + 1);
  let prefix = url.substring(5, i);
  let mimeType: string;
  let encoding: "ascii" | "base64";
  if (prefix.endsWith(";base64")) {
    prefix = prefix.substring(0, prefix.length - 7);
    encoding = "base64";
  } else {
    encoding = "ascii";
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
  readonly mimeType?: string | "text/plain";
  readonly encoding?: "ascii" | "base64";
  readonly data: string;
}): string => {
  let s1 = "";
  let s2 = "";
  if (mimeType != null && mimeType !== "text/plain") {
    s1 = mimeType;
  }
  if (encoding === "base64") {
    s2 = ";base64";
  }
  return `data:${s1}${s2},${data}`;
};

export const escapeUrlData = (value: string): string => {
  return value.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\n/g, "%0A");
};
