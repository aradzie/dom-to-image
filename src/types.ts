export type Cloner = (element: Element) => Promise<Element | null>;
export type Filter = (element: Element) => boolean;

export interface Options {
  /**
   * A custom element cloner function.
   *
   * You can use this function to clone some elements, for example those
   * which are not supported by default.
   *
   * If you have, for example, a video element, you can replace it with
   * a custom placeholder image with the help of this function.
   */
  readonly cloner?: Cloner | null;
  /**
   * An element filtering function.
   *
   * You can use this function to decide which elements
   * to include into screenshot.
   */
  readonly filter?: Filter | null;
  /**
   * Screenshot image width.
   */
  readonly width?: number | null;
  /**
   * Screenshot image height.
   */
  readonly height?: number | null;
  /**
   * Screenshot image scale.
   */
  readonly scale?: number | null;
  /**
   * Custom background color for the Screenshot image.
   */
  readonly backgroundColor?: string | null;
  /**
   * Any CSS styles to apply to an element before taking its image.
   */
  readonly style?: Partial<CSSStyleDeclaration> | null;
}
