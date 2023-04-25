import { atom } from 'jotai';
import { Usdc } from '@/dynamic/coins';
import React from 'react';

export interface Currency {
  name: string;
  Icon: React.FC;
  Rate: number;
}

export const currencyAtom = atom<Currency>({
  name: 'USDC',
  Icon: Usdc,
  Rate: 1,
});
