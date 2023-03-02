import Table from '@/components/Table';
import { sponsorColumns } from '@/constants/columns';
import React, { useMemo } from 'react';
import { usePagination, useTable } from 'react-table';
import { generate } from './api/generate';

export default function Sponsors({ sponsors }: any) {
  console.log('sponsors:', sponsors);

  const columns = useMemo(() => sponsorColumns, []);
  const data = useMemo(() => sponsors, [sponsors]);

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
