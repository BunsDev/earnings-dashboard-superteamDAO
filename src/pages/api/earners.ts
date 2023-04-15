// /pages/api/getStaticProps.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import cache from '@/utils/cache';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const base = getDatabase();
  const table = base(process.env.NEXT_PUBLIC_AIRTABLE_TABLE!);
  const projectsData = req.body.projects;

  const earners = [
    ...new Set<string>(
      projectsData
        .flatMap((project: any) => project.fields.Earner)
        .filter(Boolean)
    ),
  ];

  const fetcher = async (earner: any) => {
    const record = await table.find(earner);
    const earnerName = record?.fields?.Title;
    return earnerName;
  };

  const earnerData: { [key: string]: any } = {};
  for (const earner of earners) {
    const key = `earner:${earner}`;
    const result = await cache.fetch(key, () => fetcher(earner));
    earnerData[earner] = result;
  }

  res.status(200).json({ earnerData: earnerData });
};

export default handler;
