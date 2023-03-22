import { sponsorColumns } from '@/constants/columns';
import React, { useMemo } from 'react';
import { HeaderGroup, Row, usePagination, useTable } from 'react-table';
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
    // @ts-ignore
    { columns: columns, data: data, initialState: { pageSize: 15 } },
    usePagination
  );

  const { pageIndex } = state;

  return (
    <>
      <div className="custom-scrollbar z-0 overflow-auto">
        <div className=" mx-auto">
          <table
            {...getTableProps}
            className=" mx-auto w-[96%] table-fixed border-separate border-spacing-y-3 border-0
        bg-[#0F131A] p-2 font-sans md:w-[800px]"
          >
            <thead className="sticky top-0 z-[500]">
              {headerGroups.map((headerGroup: HeaderGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, i) => (
                    <th
                      key={i}
                      {...column.getHeaderProps}
                      className={`m-0 bg-[#161A22] p-6 text-left font-medium text-[#d0d1d3]
                  drop-shadow-xl first:rounded-l-lg last:rounded-r-lg last:text-right md:px-16`}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps}>
              {page.map((row: Row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="drop-shadow-lg" key={i}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          key={i}
                          {...cell.getCellProps}
                          className={`h-20 whitespace-nowrap border-t border-[#21252a] bg-[#0E1218] px-6 text-[#DFE4EC]  drop-shadow-md first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r last:text-right
                      md:py-4
                      md:px-16
                      `}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-center text-white">
            <div className="flex justify-evenly">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="text-white"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="text-white"
              >
                Next
              </button>
            </div>
            Page {pageIndex + 1} of {pageOptions.length}
          </div>
        </div>
      </div>
    </>
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
