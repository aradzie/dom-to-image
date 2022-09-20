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
    throw new Error("Not a data url.");
  }
  const i = url.indexOf(",");
  if (i === -1) {
    throw new Error("Not a data url.");
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

const urlPattern = /url\(['"]?([^'"]+?)['"]?\)/g;

type Piece = string | { url: string };

export const containsUrls = (content: string) => {
  return content.search(urlPattern) !== -1;
};

export const splitUrls = (content: string): Piece[] => {
  const pieces: Piece[] = [];
  let last = 0;
  let match;
  while ((match = urlPattern.exec(content)) != null) {
    const { index } = match;
    const [g0, g1] = match;
    if (index > last) {
      pieces.push(content.substring(last, index));
    }
    pieces.push({ url: g1 });
    last = index + g0.length;
  }
  if (last < content.length) {
    pieces.push(content.substring(last));
  }
  return pieces;
};

export const joinUrls = (pieces: readonly Piece[]): string => {
  return pieces
    .map((piece) => (typeof piece === "string" ? piece : `url(${piece.url})`))
    .join("");
};
