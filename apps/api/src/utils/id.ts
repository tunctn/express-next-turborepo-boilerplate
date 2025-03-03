import { customAlphabet } from "nanoid";
export const CUSTOM_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const newId = (size = 8): string => {
  const customNanoId = customAlphabet(`${CUSTOM_ALPHABET}`, size);
  return customNanoId();
};
