import { ERROR, ErrorMessage } from '@/lib/errors';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, RESERVED_WORDS } from '@packages/shared';

const ENGLISH_ALPHABET = 'abcdefghijklmnopqrstuvwxyz' as const;

export const toSlug = (name: string, maxLength = 48): string => {
  let slug = name;

  // Replace spaces with dashes
  slug = slug.replace(/ /g, '-');

  // Only allow lowercase letters, numbers, and dashes
  slug = slug.toLowerCase();

  // Update all non-english characters to english
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Convert all known non-english characters to english
  slug = slug
    .replaceAll('ı', 'i')
    .replaceAll('ç', 'c')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ç', 'c')
    .replaceAll('ö', 'o')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u');

  // Only allow English letters if its not a number or a dash
  slug = slug.replace(/[^0-9-]/g, char => {
    if (!char) return '';
    const index = ENGLISH_ALPHABET.indexOf(char);
    const englishChar = ENGLISH_ALPHABET[index] ?? '';
    return index > -1 ? englishChar : '';
  });

  // Remove consecutive dashes
  slug = slug.replace(/-{2,}/g, '-');

  // Limit  characters
  slug = slug.slice(0, maxLength);

  return slug;
};

export const testUsername = (username: string): ErrorMessage | true => {
  // Starts with a number
  if (username.match(/^\d/)) return ERROR.USERNAME['cannot-start-with-number'];

  // First char is a dash
  if (username.startsWith('-')) return ERROR.USERNAME['cannot-start-with-dash'];

  // Last char is a dash
  if (username.endsWith('-')) return ERROR.USERNAME['cannot-end-with-dash'];

  // Does not match the regex
  if (username !== toSlug(username)) return ERROR.USERNAME['invalid-format'];

  // Contains a reserved word
  if (([...RESERVED_WORDS] as string[]).includes(username)) return ERROR.USERNAME['reserved-word'];

  // Less than SLUG_MIN_LENGTH characters
  if (username.length < MIN_USERNAME_LENGTH) return ERROR.USERNAME['too-short'];

  // More than SLUG_MAX_LENGTH characters
  if (username.length > MAX_USERNAME_LENGTH) return ERROR.USERNAME['too-long'];

  return true;
};
