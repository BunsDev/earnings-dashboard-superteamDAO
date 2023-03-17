import React from 'react';

export const getStaticProps = async (context: any) => {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${process.env.AIRTABLE_TABLE}`,
    { headers: { Authorization: `Bearer ${process.env.AIRTABLE_KEY}` } }
  );
  const projects = await res.json();
  return {
    props: {
      projects: projects.records,
    },
  };
};

export default function newprojects({ projects }: any) {
  console.log(projects);
  return <div>newprojects</div>;
}
