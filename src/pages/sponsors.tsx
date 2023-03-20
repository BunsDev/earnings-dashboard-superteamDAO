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
    { columns: columns, data: data, initialState: { pageSize: 15 } },
    usePagination
  );

  const { pageIndex } = state;

  return (
    <>
      <div className="overflow-auto custom-scrollbar z-0">
        <div className=" mx-auto">
          <table
            {...getTableProps}
            className=" mx-auto table-fixed font-sans border-separate border-spacing-y-3 border-0
        bg-[#0F131A] p-2 w-[96%] md:w-[800px]"
          >
            <thead className="sticky top-0 z-[500]">
              {headerGroups.map((headerGroup: HeaderGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps}
                      className={`text-[#d0d1d3] px-6 md:px-16 py-6 text-left font-medium bg-[#161A22]
                  first:rounded-l-lg last:rounded-r-lg drop-shadow-xl m-0 last:text-right`}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps}>
              {page.map((row: Row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="drop-shadow-lg">
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps}
                          className={`bg-[#0E1218] drop-shadow-md text-[#DFE4EC] md:py-4 px-6 md:px-16 h-20  first:rounded-l-lg last:rounded-r-lg border-t first:border-l last:border-r border-[#21252a]
                      whitespace-nowrap
                      last:text-right
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
          <div className="text-white text-center">
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
