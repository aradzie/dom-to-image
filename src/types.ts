export type Cloner = (element: Element) => Promise<Element | null>;
export type Filter = (element: Element) => boolean;

export interface Options {
  readonly cloner?: Cloner | null;
  readonly filter?: Filter | null;
  readonly scale?: number;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
  readonly style?: Partial<CSSStyleDeclaration>;
}
