import { detachedClone, toSvgDataUrl } from "./svg.js";
import { Options } from "./types.js";
import { canvasToBlob, makeImage, toElement } from "./util.js";

export const toCanvas = async (
  selector: Element | string,
  options: Options,
): Promise<HTMLCanvasElement> => {
  const element = toElement(selector);
  const { width: defaultWidth, height: defaultHeight } =
    element.getBoundingClientRect();
  const {
    width = defaultWidth,
    height = defaultHeight,
    scale = 1,
    backgroundColor = null,
  } = options;
  const clone = await detachedClone(element, options);
  const image = await makeImage(toSvgDataUrl(clone, width, height));
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d")!; // eslint-disable-line
  ctx.scale(scale, scale);
  if (backgroundColor != null) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0);
  return canvas;
};

export const toBlob = async (
  selector: Element | string,
  options: Options,
  type?: string,
  quality?: any,
): Promise<Blob> => {
  return await canvasToBlob(await toCanvas(selector, options), type, quality);
};
