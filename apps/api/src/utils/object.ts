export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
};

export const omit = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;
};

export const update = <T extends Record<string, any>, U extends Partial<T>>(obj: T, updates: U): Omit<T, keyof U> & U => {
  return {
    ...obj,
    ...updates,
  } as Omit<T, keyof U> & U;
};

export const add = <T extends Record<string, any>, A extends Record<string, any>>(obj: T, adds: A): T & A => {
  return {
    ...obj,
    ...adds,
  } as T & A;
};
