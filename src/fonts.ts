import { inlineUrls } from "./inliner.js";
import { containsUrls } from "./urls.js";

export async function embedFonts(node: Element): Promise<void> {
  const cssText = await resolveAllFonts();
  const styleNode = document.createElement("style");
  node.appendChild(styleNode);
  styleNode.appendChild(document.createTextNode(cssText));
}

export async function resolveAllFonts(): Promise<string> {
  const cssTextList: string[] = [];
  for (const cssRule of getCssRules([...document.styleSheets])) {
    const cssText = cssRule.cssText;
    const baseUrl = cssRule.parentStyleSheet?.href ?? null;
    cssTextList.push(await inlineUrls(cssText, baseUrl));
  }
  return cssTextList.join("\n");
}

function getCssRules(styleSheets: readonly CSSStyleSheet[]): CSSRule[] {
  const cssRules: CSSRule[] = [];
  for (const styleSheet of styleSheets) {
    for (const cssRule of styleSheet.cssRules) {
      if (
        cssRule instanceof CSSFontFaceRule &&
        containsUrls(cssRule.style.getPropertyValue("src"))
      ) {
        cssRules.push(cssRule);
      }
    }
  }
  return cssRules;
}
