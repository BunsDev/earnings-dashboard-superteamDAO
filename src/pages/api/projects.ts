import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import fs from 'fs';
import path from 'path';
import { verifySignature } from '@upstash/qstash/nextjs';

const getProjects = async (req: NextApiRequest, res: NextApiResponse) => {
  const base = getDatabase();
  const table = base(process.env.NEXT_PUBLIC_AIRTABLE_TABLE!);

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

    const jsonProjectsData = JSON.stringify(projectsData, null, 2);
    const filePath = path.join(process.cwd(), 'public', 'projects.json');
    fs.writeFileSync(filePath, jsonProjectsData);

    res.status(200).json(projectsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects data', error });
  }
};

export default verifySignature(getProjects);

export const config = {
  api: {
    bodyParser: false,
  },
};
