import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import axios from 'axios';

function matchAbbreviations(data: any) {
  const abbreviations = {
    SOL: 'solana',
    ORCA: 'orca',
    RAY: 'raydium',
    BONK: 'bonk',
    USDT: 'tether',
    FIL: 'filecoin',
    CBX: 'cropbytes',
    SOLR: 'solrazr',
    C98: 'coin98',
    SLND: 'solend',
    UXD: 'uxd-stablecoin',
    PORT: 'port-finance',
    LARIX: 'larix',
    PRT: 'parrot-protocol',
    GRAPE: 'grape',
    DFL: 'defi-land',
  };
  const matchedData: { [key: string]: any } = {};
  for (const [abbr, name] of Object.entries(abbreviations)) {
    if (data[name]) {
      matchedData[abbr] = data[name].usd;
    }
  }
  return matchedData;
}

async function fetchCryptoPrices() {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'solana,orca,raydium,bonk,tether,filecoin,cropbytes,solrazr,coin98,solend,uxd-stablecoin,port-finance,larix,parrot-protocol,grape,defi-land',
          vs_currencies: 'USD',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
  }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const base = getDatabase();
  const table = base(process.env.NEXT_PUBLIC_AIRTABLE_TABLE!);

  try {
    const records = await table
      .select({
        view: 'Earnings Info',
        sort: [
          {
            field: 'Date',
            direction: 'desc',
          },
        ],
      })
      .all();
    const projectsData = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    const fetchedPrices = await fetchCryptoPrices();
    if (!fetchedPrices) {
      res.status(500).json({ message: 'Error fetching crypto prices' });
      return;
    }
    const matchedPrices = matchAbbreviations(fetchedPrices.data);

    let totalEarningsUSD = 0;

    for (let project of projectsData) {
      if (project.fields.Currency && project.fields.Currency !== 'USDC') {
        const currency = project.fields.Currency;
        if (typeof currency !== 'string') {
          console.error('Unexpected Currency type:', currency);
          continue;
        }

        const tokenAbbreviation = currency.split(' ')[0];

        const tokenPrice = matchedPrices[tokenAbbreviation];

        const amount = project.fields.Amount;
        if (tokenPrice && typeof amount === 'number') {
          const totalEarnings = parseFloat((amount * tokenPrice).toFixed(2));
          project.fields['Total Earnings USD'] = totalEarnings;
          totalEarningsUSD += totalEarnings;
        }
      }
    }

    res.status(200).json(projectsData);
  } catch (error) {
    console.error('Error fetching projects data:', error);
    res.status(500).json({ message: 'Error fetching projects data' });
  }
}
