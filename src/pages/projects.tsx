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
    // @ts-ignore
    { columns: columns, data: data, initialState: { pageSize: 15 } },
    usePagination
  );

  const { pageIndex } = state;

  return (
    <div className="">
      <div className="custom-scrollbar z-0 overflow-auto">
        <div className="mx-auto w-[900px] md:w-[1400px]">
          <table
            {...getTableProps}
            className=" mx-auto table-auto border-separate border-spacing-y-3 border-0 bg-[#0F131A]
        p-2 font-sans"
          >
            <thead className="sticky top-0 z-[500]">
              {headerGroups.map((headerGroup: HeaderGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, i) => (
                    <th
                      key={i}
                      {...column.getHeaderProps}
                      className={`m-0 bg-[#161A22] px-4 py-6 text-left text-sm font-medium
                  text-[#d0d1d3] drop-shadow-xl first:rounded-l-lg last:rounded-r-lg md:px-6 md:text-base`}
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
                          className={`h-20 whitespace-nowrap border-t border-[#21252a] bg-[#0E1218] p-4 text-sm text-[#DFE4EC] drop-shadow-md first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r md:px-6
                      md:text-base
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
