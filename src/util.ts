import { impl } from "./options.js";
import { DataUrl, parseDataUrl } from "./urls.js";

export const escapeRegExp = (value: string): string =>
  value.replace(/([.*+?^${}()|[\]/\\])/g, "\\$1");

export const escapeUrlData = (value: string): string =>
  value.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\n/g, "%0A");

export const styleOf = (element: Element): CSSStyleDeclaration =>
  (element as unknown as ElementCSSInlineStyle).style;

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type?: string,
  quality?: any,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob != null) {
          resolve(blob);
        } else {
          reject(new Error("canvasToBlob"));
        }
      },
      type,
      quality,
    );
  });
};

export const readBlobAsDataUrl = (body: Blob): Promise<DataUrl> => {
  return new Promise((resolve, reject) => {
    const encoder = new FileReader();
    encoder.onload = () => {
      resolve(parseDataUrl(encoder.result as string));
    };
    encoder.onerror = () => {
      reject(new Error("readBlobAsDataUrl"));
    };
    encoder.readAsDataURL(body);
  });
};

export const makeImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error("makeImage"));
    };
    if (impl.options.crossOrigin) {
      image.crossOrigin = "use-credentials";
    }
    image.src = url;
  });
};
