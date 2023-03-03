import { each, isEqual } from "lodash";

export const getObjectDifference = (
  obj1: Record<string, any>,
  obj2?: Record<string, any> | null,
): Record<string, any> => {
  if (!obj2) {
    return { ...obj1 };
  }

  const diff: Record<string, any> = {};

  each(obj1, (val, key) => {
    if (!isEqual(val, obj2[key])) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      diff[key] = val;
    }
  });

  return diff;
};
