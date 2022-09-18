import { forwardRef, ReactElement, ReactEventHandler } from "react";
import styles from "./Preview.module.css";

type Props = {
  readonly src: string;
  readonly onLoad?: ReactEventHandler;
  readonly onError?: ReactEventHandler;
};

export const Preview = forwardRef<HTMLImageElement, Props>(
  ({ src, onLoad, onError }, ref): ReactElement => (
    <img
      ref={ref}
      className={styles.preview}
      src={src}
      alt={"preview"}
      onLoad={onLoad}
      onError={onError}
    />
  ),
);
