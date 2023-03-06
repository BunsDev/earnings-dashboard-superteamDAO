import React from 'react';
import { HeaderGroup, Row, TableOptions } from 'react-table';

export default function Table({
  getTableProps,
  headerGroups,
  page,
  prepareRow,
  getTableBodyProps,
  canNextPage,
  nextPage,
  canPreviousPage,
  previousPage,
  pageIndex,
  pageOptions,
}: any) {
  return (
    <>
      <table
        {...getTableProps}
        className="w-[90%] mx-auto table-auto font-sans border-separate border-spacing-y-3 p-4 border-0
        bg-[#0F131A]"
      >
        <thead>
          {headerGroups.map((headerGroup: HeaderGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps}
                  className={`text-[#d0d1d3] px-4 py-6 text-left font-medium bg-[#161A22]
                  first:rounded-l-lg last:rounded-r-lg drop-shadow-xl md:text-base text-sm m-0`}
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
                      className={`bg-[#0E1218] drop-shadow-md text-[#DFE4EC] p-5 first:rounded-l-lg last:rounded-r-lg border-t md:text-base text-sm first:border-l last:border-r border-[#21252a]
                      last:whitespace-nowrap
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
    </>
  );
}
