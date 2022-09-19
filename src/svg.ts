import { cloneElement } from "./clone/element.js";
import { Styles } from "./clone/styles.js";
import { inlineImages } from "./inline.js";
import { Options } from "./types.js";
import { formatDataUrl } from "./urls.js";
import { escapeUrlData, styleOf } from "./util.js";

export async function toSvgDataUrl(
  element: Element,
  options: Options,
  width: number,
  height: number,
): Promise<string> {
  const styles = new Styles();
  const clone = await cloneElement(element, options, styles);
  if (clone == null) {
    throw new Error("Cannot clone the root element.");
  }
  await inlineImages(clone);
  await styles.inlineFonts();

  positionElement(styleOf(clone));
  styleElement(styleOf(clone), options);

  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  let data = escapeUrlData(new XMLSerializer().serializeToString(clone));
  data = `<foreignObject x="0" y="0" width="100%" height="100%">${data}</foreignObject>`;
  data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${data}</svg>`;
  return formatDataUrl({ mimeType: "image/svg+xml", data });
}

function positionElement(style: CSSStyleDeclaration): void {
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
}

function styleElement(
  style: CSSStyleDeclaration,
  { width, height, backgroundColor, style: styleProps }: Options,
): void {
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
}
