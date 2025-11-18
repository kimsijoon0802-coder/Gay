// FIX: Import `ReactElement` from `react` to resolve `Cannot find namespace "JSX"` error.
import type { ReactElement } from 'react';

export interface Weapon {
  id: string;
  name: string;
  icon: ReactElement;
  description: string;
  type: 'weapon' | 'ability';
}
