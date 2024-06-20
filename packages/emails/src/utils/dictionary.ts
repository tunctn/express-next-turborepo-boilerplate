import { zodT, type Locale } from '@packages/shared';
import type { ReactNode } from 'react';

export const translateTo = (locale: Locale) => {
  zodT(locale);

  return (props: Record<Locale, string>): string => {
    return props[locale];
  };
};

export const translateToNode = (locale: Locale) => {
  zodT(locale);

  return (props: Record<Locale, ReactNode>): ReactNode => {
    return props[locale];
  };
};
