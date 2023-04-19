import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // try {
  //   const response = await fetch(
  //     'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
  //   );
  //   const data = await response.json();
  //   res.status(200).json(data);
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to fetch Solana price' });
  // }
}
