import { createId } from "@paralleldrive/cuid2";
import { v4 } from "uuid";

export const randomId = () => {
  return v4();
};

export const randomCuid = () => {
  return createId();
};
