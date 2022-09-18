export namespace assets {
  /**
   * A function which loads images, fonts, etc.
   * @param url An url of the asset to load.
   * @return A promise with the asset content.
   */
  export type Loader = (url: string) => Promise<Blob>;

  /**
   * Asset loading options.
   */
  export type Options = {
    readonly cache?: RequestCache | null;
    readonly credentials?: RequestCredentials | null;
    readonly mode?: RequestMode | null;
    readonly redirect?: RequestRedirect | null;
    readonly crossOrigin?: string | null;
  };

  export let options: Options = {
    cache: "force-cache",
  };

  /**
   * Updates the asset loading options.
   */
  export const setOptions = (newOptions: Options): void => {
    options = { ...newOptions };
  };

  /**
   * Creates a new request for the fetch API
   * using the current asset loading options.
   */
  export const getRequest = (url: string): RequestInit => {
    return {
      cache: options.cache ?? undefined,
      credentials: options.credentials ?? undefined,
      mode: options.mode ?? undefined,
      redirect: options.redirect ?? undefined,
    };
  };

  /**
   * The default implementation of the asset loader.
   * @param url An url of the asset to load.
   * @return A promise with the asset content.
   */
  export const load: Loader = async (url) => {
    const response = await fetch(url, {
      ...getRequest(url),
      method: "get",
    });
    if (response.ok) {
      return await response.blob();
    } else {
      throw new Error(
        `Cannot load asset [${url}]: ${response.status} ${response.statusText}`,
      );
    }
  };
}
