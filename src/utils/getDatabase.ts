import Airtable from 'airtable';

export function getDatabase() {
  return new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_KEY }).base(
    process.env.NEXT_PUBLIC_AIRTABLE_BASE!
  );
}
