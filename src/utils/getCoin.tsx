import { Usdc, Usdt, Bonk, Solana } from '@/dynamic/coins';

export const getCoin = (value: string) => {
  switch (value) {
    case 'USDC':
      return <Usdc />;
    case 'USDT':
      return <Usdt />;
    case 'BONK':
      return <Bonk />;
    case 'SOL':
      return <Solana />;
    default:
      return <p className="text-center text-[10px] font-light">{value}</p>;
  }
};
