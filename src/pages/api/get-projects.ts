import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(process.env.PROJECTS_URL!);
    res.status(200).json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      res.status(error.response?.status || 500).json({ message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}
