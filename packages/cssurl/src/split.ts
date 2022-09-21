import { scanCssUrls } from "./scan.js";

type CssTextPiece = string | { url: string };

export function splitCssUrls(cssText: string): CssTextPiece[] {
  const pieces: CssTextPiece[] = [];
  let last = 0;
  for (const { index, length, url } of scanCssUrls(cssText)) {
    if (index > last) {
      pieces.push(cssText.substring(last, index));
    }
    pieces.push({ url });
    last = index + length;
  }
  if (last < cssText.length) {
    pieces.push(cssText.substring(last));
  }
  return pieces;
}

export function joinCssUrls(pieces: readonly CssTextPiece[]): string {
  return pieces
    .map((piece) => (typeof piece === "string" ? piece : `url(${piece.url})`))
    .join("");
}
