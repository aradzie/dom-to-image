export const fixInputElement = (element: Element, clone: Element): void => {
  if (element instanceof HTMLInputElement) {
    clone.setAttribute("value", element.value);
  }
  if (element instanceof HTMLTextAreaElement) {
    clone.textContent = element.value;
  }
};

export const fixSvgElement = (clone: Element): void => {
  if (clone instanceof SVGElement) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    if (clone instanceof SVGRectElement) {
      for (const name of ["width", "height"]) {
        const value = clone.getAttribute(name);
        if (value) {
          clone.style.setProperty(name, value);
        }
      }
    }
  }
};

export const postprocess = (element: Element, clone: Element): void => {
  fixInputElement(element, clone);
  fixSvgElement(clone);
};
