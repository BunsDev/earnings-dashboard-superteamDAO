import { sponsorColumns } from '@/constants/columns';
import useProjects from '@/utils/useProjects';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { HeaderGroup, Row, usePagination, useTable } from 'react-table';
import { PageNumber } from '@/components/PageNumber';

export default function Sponsors() {
  const projects = useProjects();
  const [groupedBySponsor, setGroupedBySponsor] = useState({});

  useEffect(() => {
    const newGroupedBySponsor = projects.reduce((groups: any, project: any) => {
      const sponsor = project.fields.Sponsor;
      if (!groups[sponsor]) {
        groups[sponsor] = [];
      }
      groups[sponsor].push(project);
      return groups;
    }, {});

    setGroupedBySponsor(newGroupedBySponsor);
  }, [projects]);

  const sponsors: any[] = useMemo(() => {
    return Object.entries(groupedBySponsor)
      .map(([sponsor, projects]) => {
        const rainmadeSum = (projects as any).reduce(
          (sum: number, project: any) => {
            return sum + (project.fields['Total Earnings USD'] || 0);
          },
          0
        );
        return {
          Name: sponsor,
          USD: rainmadeSum,
        };
      })
      .sort((a: any, b: any) => b.USD - a.USD);
  }, [groupedBySponsor]);

  const columns = useMemo(() => sponsorColumns, []);
  const data: any[] = useMemo(() => sponsors, [sponsors]);

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
    gotoPage,
  } = useTable(
    // @ts-ignore
    { columns: columns, data: data, initialState: { pageSize: 15 } },
    usePagination
  );

  const totalEntries = React.useMemo(() => data.length, [data]);
  const { pageIndex } = state;
  const entriesStart = pageIndex * 15 + 1;
  const entriesEnd = Math.min(entriesStart + 14, totalEntries);
  const currentPage = pageIndex + 1;
  const totalPages = pageOptions.length;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage - 1) {
      previousPage();
    } else if (pageNumber === currentPage + 1) {
      nextPage();
    } else {
      gotoPage(pageNumber - 1);
    }
  };

  return (
    <>
      <div className="custom-scrollbar z-0 overflow-auto">
        <div className="mx-auto">
          <div className="mx-auto w-[96%]">
            <h1 className="mt-10 text-center text-2xl font-semibold text-white">
              Sponsors
            </h1>
            <Box
              w="fit-content"
              py={6}
              px={4}
              my={8}
              mx="auto"
              rounded="lg"
              bg="#121726"
              boxShadow="0px 2px 1px rgba(255, 255, 255, 0.08), inset 0px 2px 4px rgba(0, 0, 0, 0.48)"
            >
              <table
                {...getTableProps}
                className=" mx-auto w-[96%] table-fixed border-separate border-spacing-y-3 border-0
        bg-[#121726] p-2 font-sans md:w-[800px]"
              >
                <thead className="sticky top-0 z-[500]">
                  {headerGroups.map((headerGroup: HeaderGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                      {headerGroup.headers.map((column, i) => (
                        <th
                          key={i}
                          {...column.getHeaderProps}
                          className={`m-0 bg-[#191F34] p-6 text-left font-medium text-[#d0d1d3]
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
                      <tr
                        {...row.getRowProps()}
                        className="drop-shadow-lg"
                        key={i}
                      >
                        {row.cells.map((cell, i) => {
                          return (
                            <td
                              key={i}
                              {...cell.getCellProps}
                              className={`h-20 whitespace-nowrap border-t border-[#21252a] bg-[#101523] px-6 text-[#DFE4EC]  drop-shadow-md first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r last:text-right
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
            </Box>
          </div>
        </div>
        <div className="mx-auto flex w-[96%] max-w-[1200px] justify-between py-16 text-white">
          <div className="flex items-center">
            Showing {entriesStart}-{entriesEnd} out of {totalEntries} entries
          </div>
          <ul className="flex items-center justify-center gap-4 text-white">
            {currentPage > 2 && (
              <>
                <PageNumber
                  pageNumber={1}
                  onClick={() => handlePageChange(1)}
                />
                <li className="px-2">...</li>
              </>
            )}
            {currentPage > 1 && (
              <PageNumber
                pageNumber={currentPage - 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
            )}
            <PageNumber pageNumber={currentPage} isActive onClick={() => {}} />
            {currentPage < totalPages && (
              <PageNumber
                pageNumber={currentPage + 1}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            )}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <li className="px-2">...</li>}
                <PageNumber
                  pageNumber={totalPages}
                  onClick={() => handlePageChange(totalPages)}
                />
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
