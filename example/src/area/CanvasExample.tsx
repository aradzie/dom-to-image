import { ReactElement, useEffect, useRef } from "react";
import styles from "./CanvasExample.module.css";

export const CanvasExample = (): ReactElement => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.font = "1rem sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("This is canvas", 100, 50);
  }, []);
  return (
    <canvas ref={ref} className={styles.canvas} width={200} height={100} />
  );
};
