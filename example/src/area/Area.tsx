import { forwardRef, ReactElement } from "react";
import styles from "./Area.module.css";
import image1 from "./assets/image1.png";
import image2 from "./assets/image2.png";
import image3 from "./assets/image3.svg";
import { CanvasExample } from "./CanvasExample.js";

type Props = {
  /* Empty */
};

export const Area = forwardRef<HTMLDivElement, Props>(
  (props, ref): ReactElement => (
    <div ref={ref} className={styles.area}>
      <h1>Example document</h1>
      <p>
        Just then her head struck against the roof of the hall: in fact she was
        now more than nine feet high, and she at once took up the little golden
        key and hurried off to the garden door.
      </p>
      <p>
        <span style={{ color: "red" }}>red</span>
        {" / "}
        <span style={{ color: "green" }}>green</span>
        {" / "}
        <span style={{ color: "blue" }}>blue</span>
        {" / "}
        <span style={{ fontWeight: "bold" }}>bold</span>
        {" / "}
        <span style={{ fontStyle: "italic" }}>italic</span>
        {" / "}
        <span style={{ textDecoration: "underline" }}>underline</span>
      </p>
      <p>
        <span className={styles.hasBefore}>has :before</span>
        {" / "}
        <span className={styles.hasAfter}>has :after</span>
        {" / "}
        <span className={styles.usesCustomProp}>uses var(--example)</span>
      </p>
      <figure>
        <figcaption>Static image</figcaption>
        <div className={styles.box}>
          <img className={styles.exampleImage} src={image1} alt={"image1"} />
          <img className={styles.exampleImage} src={image2} alt={"image2"} />
          <img className={styles.exampleImage} src={image3} alt={"image3"} />
        </div>
      </figure>
      <figure>
        <figcaption>Static background image</figcaption>
        <div className={styles.box}>
          <div className={styles.backgroundImage1} />
          <div className={styles.backgroundImage2} />
          <div className={styles.backgroundImage3} />
        </div>
      </figure>
      <figure>
        <figcaption>Dynamic canvas</figcaption>
        <div className={styles.box}>
          <CanvasExample />
          <CanvasExample />
          <CanvasExample />
        </div>
      </figure>
      <p>one</p>
      <p>two</p>
      <p>three</p>
      <div
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          display: "flex",
          placeContent: "center",
          width: "10rem",
          height: "10rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          outline: "1px solid red",
        }}
      >
        <span>Outstanding</span>
      </div>
    </div>
  ),
);
