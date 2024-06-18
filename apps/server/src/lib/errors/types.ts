import { Locale } from '@packages/shared';

export type ErrorMessage = Record<Locale, string>;
export type MessageGroup = Record<string, ErrorMessage>;
