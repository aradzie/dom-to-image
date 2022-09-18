import { cloneElement } from "./clone/element.js";
import { embedFonts } from "./fonts.js";
import { inlineImages } from "./images.js";
import { Options } from "./types.js";
import { formatDataUrl } from "./urls.js";
import { escapeUrlData, styleOf } from "./util.js";

export const positionElement = (style: CSSStyleDeclaration): void => {
  for (const name of [
    "inset",
    "inset-block",
    "inset-block-start",
    "inset-block-end",
    "inset-inline",
    "inset-inline-start",
    "inset-inline-end",
    "left",
    "right",
    "top",
    "bottom",
  ]) {
    style.removeProperty(name);
  }
  style.setProperty("inset", "0px");
};

export const styleElement = (
  style: CSSStyleDeclaration,
  { width, height, backgroundColor, style: styleProps }: Options,
): void => {
  if (width != null) {
    style.width = `${width}px`;
  }
  if (height != null) {
    style.height = `${height}px`;
  }
  if (backgroundColor != null) {
    style.backgroundColor = backgroundColor;
  }
  if (styleProps != null) {
    Object.assign(style, styleProps);
  }
};

export const detachedClone = async (
  element: Element,
  options: Options,
): Promise<Element> => {
  const clone = await cloneElement(element, options);
  if (clone == null) {
    throw new Error("Cannot clone the root element.");
  }
  await inlineImages(clone);
  await embedFonts(clone);
  const style = styleOf(clone);
  positionElement(style);
  styleElement(style, options);
  return clone;
};

export const toSvgDataUrl = (
  element: Element,
  width: number,
  height: number,
): string => {
  element.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  let data = escapeUrlData(new XMLSerializer().serializeToString(element));
  data = `<foreignObject x="0" y="0" width="100%" height="100%">${data}</foreignObject>`;
  data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${data}</svg>`;
  return formatDataUrl({ mimeType: "image/svg+xml", data });
};
