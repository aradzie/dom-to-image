import { impl } from "./options.js";
import { Loader } from "./types.js";

export const load: Loader = async (url: string): Promise<Blob> => {
  const response = await fetch(url, {
    credentials: impl.options.credentials ?? undefined,
  });
  if (response.ok) {
    return await response.blob();
  } else {
    throw new Error(
      `Cannot load [${url}]: ${response.status} ${response.statusText}`,
    );
  }
};
