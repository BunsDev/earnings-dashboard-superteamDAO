import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import { supabase } from '@/lib/supabase';
import { verifySignature } from '@upstash/qstash/nextjs';
import axios from 'axios';

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
  EUROE: 'euroe-stablecoin',
  ISC: 'international-stable-currency',
};

function matchAbbreviations(data: any) {
  const matchedData: { [key: string]: any } = {};
  for (const [abbr, name] of Object.entries(abbreviations)) {
    if (data[name]) {
      matchedData[abbr] = data[name].usd;
    }
  }
  return matchedData;
}

async function fetchCryptoPrices() {
  const cryptos = Object.values(abbreviations).join(',');
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: cryptos,
          vs_currencies: 'USD',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
  }
}

const getProjects = async (req: NextApiRequest, res: NextApiResponse) => {
  const base = getDatabase();
  const table = base(process.env.AIRTABLE_TABLE!);

  try {
    const records = await table
      .select({
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
          project.fields['Total Earnings USD'] = parseFloat(
            (amount * tokenPrice).toFixed(2)
          );
        }
      }
    }

    const jsonProjectsData = JSON.stringify(projectsData, null, 2);

    const { error } = await supabase.storage
      .from('earnings')
      .upload(
        'projects.json',
        new Blob([jsonProjectsData], { type: 'application/json' }),
        { upsert: true }
      );

    if (error) {
      console.error('Error uploading file to Supabase:', error);
      res
        .status(500)
        .json({ message: 'Error uploading file to Supabase', error });
      return;
    }

    res.status(200).json(projectsData);
  } catch (error) {
    console.error('Error fetching projects data:', error);
    res.status(500).json({ message: 'Error fetching projects data' });
  }
};

export default verifySignature(getProjects);

export const config = {
  api: {
    bodyParser: false,
  },
};
