export const isEmpty = (value: unknown): boolean => {
  if (value === null) {
    return true;
  }
  if (typeof value !== "number" && value === "") {
    return true;
  }
  if (typeof value === "undefined" || value === undefined) {
    return true;
  }
  if (value !== null && typeof value === "object" && !Object.keys(value).length) {
    return true;
  }
  return false;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const objectWithoutKeys = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Omit<T, (typeof keys)[number]> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};
