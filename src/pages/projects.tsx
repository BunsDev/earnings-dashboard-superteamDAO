import { useTable, usePagination } from 'react-table';
import React, { createContext, useContext, useMemo } from 'react';
import { generate } from './api/generate';
import Table from '@/components/Table';
import { projectColumns } from '@/constants/columns';
import cache from '@/utils/cache';

const EarnerDataContext = React.createContext({});

export default function Projects({ projects }: any) {
  const columns = useMemo(() => projectColumns, []);
  const data = useMemo(() => projects, [projects]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    prepareRow,
    pageOptions,
    state,
  } = useTable(
    { columns: columns, data: data, initialState: { pageSize: 15 } },
    usePagination
  );

  const { pageIndex } = state;

  return (
    <div className="">
      <div className="overflow-auto custom-scrollbar z-0">
        <div className="w-[900px] md:w-[1200px] mx-auto">
          <Table
            getTableProps={getTableProps}
            headerGroups={headerGroups}
            page={page}
            prepareRow={prepareRow}
            getTableBodyProps={getTableBodyProps}
            canNextPage={canNextPage}
            nextPage={nextPage}
            canPreviousPage={canPreviousPage}
            previousPage={previousPage}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
          />
        </div>
      </div>
      hello
    </div>
  );
}

export const getStaticProps = async (context: any) => {
  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE}/${process.env.NEXT_PUBLIC_AIRTABLE_TABLE}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}`,
      },
    }
  );

  const projects = await res.json();
  const records = projects.records;

  const earners = [
    ...new Set<string>(
      records.flatMap((project: any) => project.fields.Earner).filter(Boolean)
    ),
  ];

  const fetcher = async (earner: any) => {
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE}/${process.env.NEXT_PUBLIC_AIRTABLE_TABLE}/${earner}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}`,
        },
      }
    );
    const data = await res.json();
    const earnerName = data?.fields?.Title;
    return earnerName;
  };
  const earnerData: { [key: string]: any } = {};
  for (const earner of earners) {
    const key = `earner:${earner}`;
    const result = await cache.fetch(key, () => fetcher(earner));
    earnerData[earner] = result;
  }

  console.log(earnerData);

  return {
    props: {
      projects: projects.records,
      earnerData: earnerData,
    },
  };
};
