declare module "jsdom" {
  class JSDOM {
    readonly window: Window;
    constructor(
      html?: string,
      options?: {
        readonly url?: string;
        readonly contentType?: string;
        readonly pretendToBeVisual?: boolean;
      },
    );
  }
}
