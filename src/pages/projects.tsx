import { useTable } from 'react-table';
import React, { useMemo } from 'react';
import { generate } from './api/generate';

interface Project {
  Project: string;
  Type: string;
  Rainmaker: string;
  'Date Given': string;
  'Country/Region': string;
}

export default function Projects({ sheetData }: { sheetData: any }) {
  console.log(sheetData);
  const columns = useMemo(
    () => [
      {
        id: 'id',
        Cell: ({ row, flatRows }: any) => {
          return flatRows.indexOf(row) + 1;
        },
      },
      {
        Header: 'Project',
        accessor: 'Project',
      },
      {
        Header: 'Type',
        accessor: 'Type',
      },
      {
        Header: 'Rainmaker',
        accessor: 'Rainmaker',
      },
      {
        Header: 'Date Given',
        accessor: 'Date Given',
      },
      {
        Header: 'Country/Region',
        accessor: 'Country/Region',
      },
    ],
    []
  );
  const data = useMemo(() => sheetData, [sheetData]);

  const table = useTable({ columns: columns, data: data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;

  return (
    <>
      <table
        {...getTableProps}
        className="table-auto font-sans border-separate border-spacing-y-3 p-4 mx-8 border-0
        bg-[#0F131A]"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps}
                  className="text-[#d0d1d3] px-4 py-6 text-left font-medium bg-[#161A22]
                  first:rounded-l-lg last:rounded-r-lg drop-shadow-xl m-0"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="drop-shadow-lg">
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps}
                      className="bg-[#0E1218] drop-shadow-md text-[#DFE4EC] p-4 first:rounded-l-lg last:rounded-r-lg border-t  first:border-l last:border-r border-[#21252a]"
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
