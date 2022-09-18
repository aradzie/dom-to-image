import { ReactElement, useEffect, useRef } from "react";
import { ref } from "../util.js";
import styles from "./CanvasExample.module.css";

export const CanvasExample = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref(canvasRef).getContext("2d") as CanvasRenderingContext2D;
    ctx.font = "1rem sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("This is canvas", 100, 50);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={200}
      height={100}
    />
  );
};
