import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import { supabase } from '@/lib/supabase';
import { verifySignature } from '@upstash/qstash/nextjs';
import groupBy from 'lodash/groupBy';

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

    const groupedBySponsor = groupBy(
      projectsData,
      (project) => project.fields['Sponsor']
    );

    const sponsors = () => {
      return Object.entries(groupedBySponsor)
        .map(([sponsor, projects]) => {
          const rainmadeSum = (projects as any).reduce(
            (sum: number, project: any) => {
              return sum + (project.fields['Total Earnings USD'] || 0);
            },
            0
          );
          return {
            Name: sponsor,
            USD: rainmadeSum,
          };
        })
        .sort((a: any, b: any) => b.USD - a.USD);
    };

    const sponsorsData = sponsors();
    const jsonSponsorsData = JSON.stringify(sponsorsData, null, 2);

    const { error } = await supabase.storage
      .from('earnings')
      .upload(
        'sponsors.json',
        new Blob([jsonSponsorsData], { type: 'application/json' }),
        { upsert: true }
      );

    if (error) {
      console.error('Error uploading file to Supabase:', error);
      res
        .status(500)
        .json({ message: 'Error uploading file to Supabase', error });
      return;
    }

    res.status(200).json({ projects: projectsData, sponsors: sponsorsData });
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
