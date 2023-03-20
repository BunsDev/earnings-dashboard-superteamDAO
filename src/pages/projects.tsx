import { useTable, usePagination, HeaderGroup, Row } from 'react-table';
import React, { useEffect, useMemo } from 'react';
import { projectColumns } from '@/constants/columns';
import cache from '@/utils/cache';
import { useAtom } from 'jotai';
import { earnerAtom } from '@/context/earners';

export default function Projects({ projects, earnerData }: any) {
  const columns = useMemo(() => projectColumns, []);
  const data = useMemo(() => projects, [projects]);
  const [earners, setEarners] = useAtom(earnerAtom);

  useEffect(() => {
    setEarners(earnerData);
  }, []);

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
        <div className="w-[900px] md:w-[1400px] mx-auto">
          <table
            {...getTableProps}
            className=" mx-auto table-auto font-sans border-separate border-spacing-y-3 border-0
        bg-[#0F131A] p-2"
          >
            <thead className="sticky top-0 z-[500]">
              {headerGroups.map((headerGroup: HeaderGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps}
                      className={`text-[#d0d1d3] md:px-6 px-4 py-6 text-left font-medium bg-[#161A22]
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
                          className={`bg-[#0E1218] drop-shadow-md text-[#DFE4EC] py-4 md:px-6 px-4 h-20  first:rounded-l-lg last:rounded-r-lg border-t md:text-base text-sm first:border-l last:border-r border-[#21252a]
                      whitespace-nowrap
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

  return {
    props: {
      projects: projects.records,
      earnerData: earnerData,
    },
  };
};
