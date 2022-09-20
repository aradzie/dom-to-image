import { toSvgDataUrl } from "./svg.js";
import { Options } from "./types.js";
import { canvasToBlob, elementSize, makeImage, toElement } from "./util.js";

export async function captureElementToCanvas(
  selector: Element | string,
  options: Options = {},
): Promise<HTMLCanvasElement> {
  const element = toElement(selector);
  const [defaultWidth, defaultHeight] = elementSize(element);
  const width = Math.max(1, options.width ?? defaultWidth);
  const height = Math.max(1, options.height ?? defaultHeight);
  const scale = Math.max(0.001, (options.scale ?? 1) * devicePixelRatio);
  const backgroundColor = options.backgroundColor ?? null;
  const dataUrl = await toSvgDataUrl(element, options, width, height);
  const image = await makeImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d")!; // eslint-disable-line
  ctx.scale(scale, scale);
  if (backgroundColor != null) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0);
  return canvas;
}

export async function captureElementToImage(
  selector: Element | string,
  options?: Options,
  type?: string,
  quality?: any,
): Promise<Blob> {
  return await canvasToBlob(
    await captureElementToCanvas(selector, options),
    type,
    quality,
  );
}
