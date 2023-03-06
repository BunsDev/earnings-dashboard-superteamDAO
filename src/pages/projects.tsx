import { useTable, usePagination } from 'react-table';
import React, { useMemo } from 'react';
import { generate } from './api/generate';
import Table from '@/components/Table';
import { projectColumns } from '@/constants/columns';

export default function Projects({ sheetData }: { sheetData: any }) {
  console.log(sheetData);
  const columns = useMemo(() => projectColumns, []);
  const data = useMemo(() => sheetData, [sheetData]);

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
    ...new Set(sheetData.map((item: any) => item['Country/Region'])),
  ];
  console.log(uniqueCoins);

  return (
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
  );
}

export async function getServerSideProps() {
  let data = await generate();

  return {
    props: {
      ...data,
    }, // will be passed to the page component as props
  };
}
