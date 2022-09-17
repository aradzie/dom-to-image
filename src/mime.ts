export namespace mime {
  export const mimeTypes: Record<string, string> = {
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    tiff: "image/tiff",
    ttf: "application/font-truetype",
    woff2: "application/font-woff",
    woff: "application/font-woff",
  };

  export const fileExt = (url: string): string => {
    let i;
    i = url.indexOf("#");
    if (i !== -1) {
      url = url.substring(0, i);
    }
    i = url.indexOf("?");
    if (i !== -1) {
      url = url.substring(0, i);
    }
    i = url.lastIndexOf(".");
    if (i !== -1) {
      return url.substring(i + 1).toLowerCase();
    } else {
      return "";
    }
  };

  export const mimeType = (
    url: string,
    mimeType: string | null = null,
  ): string => {
    return mimeTypes[fileExt(url)] ?? mimeType ?? "application/octet-stream";
  };
}
