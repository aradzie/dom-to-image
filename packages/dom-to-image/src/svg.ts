import { Cloner } from "./cloner.js";
import { Options } from "./types.js";
import { escapeUrlData, formatDataUrl } from "./urls.js";

const nsXhtml = "http://www.w3.org/1999/xhtml";
const nsSvg = "http://www.w3.org/2000/svg";

export async function toSvgDataUrl(
  element: Element,
  options: Options,
  width: number,
  height: number,
): Promise<string> {
  const cloner = new Cloner(options);
  const clone = await cloner.cloneElement(element);
  if (clone == null) {
    throw new Error("Cannot clone the root element.");
  }
  const style = document.createElement("style");
  const svg = makeSvgElement(clone, style, width, height);
  applyOptions(clone, options);
  await cloner.inlineFonts();
  await cloner.copyStyles();
  style.appendChild(document.createTextNode(cloner.getStyleText()));
  const data = escapeUrlData(new XMLSerializer().serializeToString(svg));
  return formatDataUrl({ mimeType: "image/svg+xml", data });
}

function makeSvgElement(
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

function applyOptions(
  clone: Element,
  { width, height, backgroundColor, style: newStyle }: Options,
): void {
  const { style } = clone as HTMLElement;
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
  if (width != null) {
    style.width = `${width}px`;
  }
  if (height != null) {
    style.height = `${height}px`;
  }
  if (backgroundColor != null) {
    style.backgroundColor = backgroundColor;
  }
  if (newStyle != null) {
    Object.assign(style, newStyle);
  }
}
