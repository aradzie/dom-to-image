export type Cloner = (element: Element) => Promise<Element | null>;
export type Filter = (element: Element) => boolean;
export type Loader = (url: string) => Promise<Blob>;

export interface Options {
  readonly loader?: Loader;
  readonly credentials?: RequestCredentials | null;
  readonly crossOrigin?: string | null;
  readonly cloner?: Cloner | null;
  readonly filter?: Filter | null;
  readonly scale?: number;
  readonly width?: number;
  readonly height?: number;
  readonly backgroundColor?: string;
  readonly style?: Partial<CSSStyleDeclaration>;
}
