import { customAlphabet } from "nanoid";
export const CUSTOM_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const newId = (size = 8): string => {
  const customNanoId = customAlphabet(`${CUSTOM_ALPHABET}`, size);
  return customNanoId();
};

export const DATABASE_ROW_ID_LENGTH = 16;
export const newDatabaseRowId = () => newId(DATABASE_ROW_ID_LENGTH);
export const isValidNewDatabaseRowId = (id: string) => {
  // Check the length
  if (id.length !== DATABASE_ROW_ID_LENGTH) return "id-length-mismatch";

  // If it contains anything other than custom alphabet, it's not a valid id
  const validCharactersRegex = new RegExp(`^[${CUSTOM_ALPHABET}]+$`);
  if (!validCharactersRegex.test(id)) return "invalid-characters";

  return true;
};
