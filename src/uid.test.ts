import test from "ava";
import { uid } from "./uid.js";

test("uid", (t) => {
  const a = uid();
  const b = uid();
  t.regex(a, /[a-zA-Z0-9]{8}/);
  t.regex(b, /[a-zA-Z0-9]{8}/);
  t.not(a, b);
});
