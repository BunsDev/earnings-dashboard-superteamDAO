import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/utils/getDatabase';
import fs from 'fs';
import path from 'path';

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

    // Convert the projectsData to a JSON string
    const jsonProjectsData = JSON.stringify(projectsData, null, 2);

    // Define the path and filename for the JSON file
    const filePath = path.join(process.cwd(), 'public', 'projects.json');

    // Write the JSON data to the file
    fs.writeFileSync(filePath, jsonProjectsData);

    res.status(200).json(projectsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects data', error });
  }
};

export default getProjects;
