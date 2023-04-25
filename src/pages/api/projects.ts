import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import { supabase } from '@/lib/supabase';
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
    res.status(500).json({ message: 'Error fetching projects data', error });
  }
};

export default verifySignature(getProjects);

export const config = {
  api: {
    bodyParser: false,
  },
};
