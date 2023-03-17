import { useTable, usePagination } from 'react-table';
import React, { useMemo } from 'react';
import { generate } from './api/generate';
import Table from '@/components/Table';
import { projectColumns } from '@/constants/columns';

export default function Projects({ projects }: { projects: any }) {
  console.log(projects);
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

  const uniqueCoins = [
    ...new Set(projects.map((item: any) => item['Country/Region'])),
  ];
  console.log(uniqueCoins);

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
