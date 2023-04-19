import React, { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

interface CurrencyRates {
  USDC: 1;
  INR: number | null;
  VND: number | null;
  TRY: number | null;
  MXN: number | null;
  EUR: number | null;
}

const currencyRatesAtom = atom<CurrencyRates>({
  USDC: 1,
  INR: null,
  VND: null,
  TRY: null,
  MXN: null,
  EUR: null,
});

const fetchCurrencyData = async (
  setCurrencyRates: (rates: CurrencyRates) => void
) => {
  const currencies = ['usd', 'inr', 'vnd', 'try', 'mxn', 'eur'] as const;
  const fetchedRates: Partial<CurrencyRates> = {};

  await Promise.all(
    currencies.map(async (currency) => {
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}/usd.json`
      );
      const data = await response.json();
      fetchedRates[currency.toUpperCase() as keyof CurrencyRates] = data.usd;
    })
  );

  setCurrencyRates(fetchedRates as CurrencyRates);
};

const useCurrencyRates = (): CurrencyRates => {
  const [currencyRates, setCurrencyRates] =
    useAtom<CurrencyRates>(currencyRatesAtom);

  useEffect(() => {
    fetchCurrencyData(setCurrencyRates);
  }, []);

  return currencyRates;
};

export default useCurrencyRates;
