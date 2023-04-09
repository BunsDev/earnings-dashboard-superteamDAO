import { atom } from 'jotai';

interface RowAtomState {
  fields: {
    Name: string;
    Currency: string;
    Date: string;
    Rainmaker: string;
    Sponsor: string;
    Type: string;
    'Total Earnings USD': number;
  };
}

export const rowAtom = atom<{} | null>({});
