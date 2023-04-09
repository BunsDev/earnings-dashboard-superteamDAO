import { getDatabase } from '@/utils/getDabase';
import { NextApiRequest, NextApiResponse } from 'next';
// import { getDatabase } from './getDabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const base = getDatabase();
  const table = base(process.env.NEXT_PUBLIC_AIRTABLE_TABLE!);

  const projects = await table
    .select({
      sort: [{ field: 'Date', direction: 'desc' }],
    })
    .all();

  const projectsData = projects.map((project: any) => {
    return {
      id: project.id,
      fields: {
        Currency: project.fields.Currency ?? null,
        Amount: project.fields.Amount ?? null,
        Earner: project.fields.Earner ?? null,
        'Total Earnings USD': project.fields['Total Earnings USD'] ?? null,
        Sponsor: project.fields.Sponsor ?? null,
        Rainmaker: project.fields.Rainmaker ?? null,
        Name: project.fields.Name ?? null,
        Type: project.fields.Type ?? null,
        Foundation: project.fields.Foundation ?? null,
        'USD Token Value': project.fields['USD Token Value'] ?? null,
        Region: project.fields.Region ?? null, // Extract only the IDs of linked records
        'MM/YYYY': project.fields['MM/YYYY'] ?? null,
        Date: project.fields.Date ?? null,
        'Region Name': project.fields['Region Name'] ?? null,
      },
    };
  });

  res.status(200).json(projectsData);
}
