import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { verifySignature } from '@upstash/qstash/nextjs';
import groupBy from 'lodash/groupBy';
import axios from 'axios';

interface Project {
  id: string;
  fields: {
    Rainmaker: string;
    'Total Earnings USD'?: number;
    Date: string;
  };
}

const isNumber = (value: any): value is number => typeof value === 'number';

const getRainmakers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const projects = axios.get(
      'https://socftnkojidkvtmjmyha.supabase.co/storage/v1/object/public/earnings/projects.json'
    );

    const records = (await projects).data;

    const projectsData = records.map((record: any) => ({
      id: record.id,
      fields: record.fields,
    })) as Project[];

    const groupedByRainmaker = groupBy(
      projectsData,
      (project) => project.fields['Rainmaker']
    );

    const rainmakers = Object.entries(groupedByRainmaker)
      .map(([rainmaker, projects]) => ({
        Name: rainmaker,
        USD: parseFloat(
          projects
            .reduce(
              (sum, project) =>
                isNumber(project.fields['Total Earnings USD'])
                  ? sum + project.fields['Total Earnings USD']
                  : sum,
              0
            )
            .toFixed(2)
        ),
      }))
      .sort((a, b) => b.USD - a.USD)
      .map((rainmaker, index) => ({ Rank: index + 1, ...rainmaker }));

    const jsonRainmakerData = JSON.stringify(rainmakers, null, 2);

    const { error } = await supabase.storage
      .from('earnings')
      .upload(
        'rainmakers.json',
        new Blob([jsonRainmakerData], { type: 'application/json' }),
        { upsert: true }
      );

    if (error) {
      console.error('Error uploading file to Supabase:', error);
      return res
        .status(500)
        .json({ message: 'Error uploading file to Supabase', error });
    }

    return res.status(200).json(rainmakers);
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return res
      .status(500)
      .json({ message: 'Error fetching projects data', error });
  }
};

export default verifySignature(getRainmakers);

export const config = {
  api: {
    bodyParser: false,
  },
};
