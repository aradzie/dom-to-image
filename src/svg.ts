import { cloneElement } from "./clone.js";
import { inlineImages } from "./inline.js";
import { Styles } from "./styles.js";
import { Options } from "./types.js";
import { formatDataUrl } from "./urls.js";
import { escapeUrlData, styleOf } from "./util.js";

const nsXhtml = "http://www.w3.org/1999/xhtml";
const nsSvg = "http://www.w3.org/2000/svg";

export async function toSvgDataUrl(
  element: Element,
  options: Options,
  width: number,
  height: number,
): Promise<string> {
  const styles = new Styles();
  const clone = await detachedClone(element, options, styles);
  const svg = toSvg(clone, styles.getStyleElement(), width, height);
  const data = escapeUrlData(new XMLSerializer().serializeToString(svg));
  return formatDataUrl({ mimeType: "image/svg+xml", data });
}

async function detachedClone(
  element: Element,
  options: Options,
  styles: Styles,
) {
  const clone = await cloneElement(element, options, styles);
  if (clone == null) {
    throw new Error("Cannot clone the root element.");
  }
  await inlineImages(clone);
  await styles.inlineFonts();
  positionElement(styleOf(clone));
  styleElement(styleOf(clone), options);
  return clone;
}

function toSvg(
  clone: Element,
  style: Element,
  width: number,
  height: number,
): Element {
  clone.setAttribute("xmlns", nsXhtml);
  style.setAttribute("xmlns", nsXhtml);
  const foreignObject = document.createElementNS(nsSvg, "foreignObject");
  foreignObject.setAttribute("x", "0");
  foreignObject.setAttribute("y", "0");
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.appendChild(clone);
  const svg = document.createElementNS(nsSvg, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.appendChild(style);
  svg.appendChild(foreignObject);
  return svg;
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
