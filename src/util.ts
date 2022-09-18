import { assets } from "./assets.js";
import { DataUrl, parseDataUrl } from "./urls.js";

export const toElement = (selector: Element | string): Element => {
  if (typeof selector === "string") {
    const element = document.querySelector<Element>(selector);
    if (element == null) {
      throw new Error(`Element [${selector}] not found.`);
    }
    return element;
  } else {
    return selector;
  }
};

export const elementSize = (element: Element): [number, number] => {
  const { scrollWidth, scrollHeight } = element;
  const style = getComputedStyle(element);
  const pixelSizeOf = (name: string): number => {
    const value = style.getPropertyValue(name);
    if (value !== "" && value.endsWith("px")) {
      return Number.parseFloat(value.substring(0, value.length - 2));
    } else {
      return 0;
    }
  };
  const borderLeftWidth = pixelSizeOf("border-left-width");
  const borderRightWidth = pixelSizeOf("border-right-width");
  const borderTopWidth = pixelSizeOf("border-top-width");
  const borderBottomWidth = pixelSizeOf("border-bottom-width");
  const width = scrollWidth + borderLeftWidth + borderRightWidth;
  const height = scrollHeight + borderTopWidth + borderBottomWidth;
  return [width, height];
};

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
    const { options } = assets;
    if (options.crossOrigin != null) {
      image.crossOrigin = options.crossOrigin;
    }
    image.src = url;
  });
};
