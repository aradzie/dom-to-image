import { RefObject } from "react";

export const ref = <T>({ current }: RefObject<T>): T => {
  if (current == null) {
    throw new Error();
  } else {
    return current;
  }
};
