import Table from '@/components/Table';
import { rainmakerColumns } from '@/constants/columns';
import React, { useMemo } from 'react';
import { usePagination, useTable } from 'react-table';
import { generate } from './api/generate';

export default function Rainmakers({ rainmakers }: any) {
  console.log('rainmakers:', rainmakers);

  const columns = useMemo(() => rainmakerColumns, []);
  const data = useMemo(() => rainmakers, [rainmakers]);

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
