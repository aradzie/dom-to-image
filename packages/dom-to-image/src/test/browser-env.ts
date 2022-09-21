const { JSDOM } = require("jsdom"); // eslint-disable-line
const restrictedGlobals = require("eslint-restricted-globals"); // eslint-disable-line

export function loadHtml(html: string, scope: any = global) {
  const jsdom = new JSDOM(html, {
    url: "https://localhost/",
    pretendToBeVisual: true,
  });
  const { window } = jsdom;
  const scopeKeys = Object.getOwnPropertyNames(scope);
  const windowKeys = Object.getOwnPropertyNames(window);
  const keys = ["window", "document", "navigator"];
  for (const key of windowKeys) {
    if (
      !/^_/.test(key) && // Private fields.
      !/^on/.test(key) && // Event handlers.
      !keys.includes(key) &&
      !scopeKeys.includes(key) &&
      !restrictedGlobals.includes(key)
    ) {
      keys.push(key);
    }
  }
  for (const key of keys) {
    scope[key] = window[key];
  }

  const cleanup = () => {
    for (const key of keys) {
      delete scope[key];
    }
    delete scope["_JSDOM"];
    delete scope["_removeJSDOM"];
  };
  scope._JSDOM = jsdom;
  scope._removeJSDOM = cleanup;
  return cleanup;
}
