import { captureElementToImage } from "@sosimple/dom-to-image";
import { createRef, ReactElement, useEffect, useState } from "react";
import styles from "./App.module.css";
import { Area } from "./area/Area.js";
import defaultSrc from "./assets/checkerboard.png";
import { Preview } from "./Preview.js";
import { ref } from "./util.js";

export const App = (): ReactElement => {
  const areaRef = createRef<HTMLDivElement>();
  const previewRef = createRef<HTMLImageElement>();
  const [src, setSrc] = useState(defaultSrc);
  const [status, setStatus] = useState("Working...");
  useEffect(() => {
    captureElementToImage(ref(areaRef), {})
      .then((blob) => {
        setSrc(URL.createObjectURL(blob));
        setStatus("Screenshot created successfully.");
      })
      .catch((error) => {
        console.error(error);
        setStatus(String(error));
      });
  }, []);
  const reportSizes = () => {
    if (src !== defaultSrc) {
      const areaRect = ref(areaRef).getBoundingClientRect();
      const previewRect = ref(previewRef).getBoundingClientRect();
      console.log("Element size:", areaRect.width, areaRect.height);
      console.log("Screenshot size:", previewRect.width, previewRect.height);
    }
  };
  return (
    <div className={styles.app}>
      <div className={styles.panes}>
        <div className={styles.leftHeader}>DOCUMENT</div>
        <div className={styles.rightHeader}>SCREENSHOT</div>
        <div className={styles.leftArea}>
          <Area ref={areaRef} />
        </div>
        <div className={styles.rightArea}>
          <Preview
            ref={previewRef}
            src={src}
            onLoad={() => {
              reportSizes();
            }}
            onError={() => {
              console.error("Cannot load preview.");
            }}
          />
        </div>
      </div>
      <div className={styles.status}>{status}</div>
    </div>
  );
};
