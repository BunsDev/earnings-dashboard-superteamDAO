import { rainmakerColumns } from '@/constants/columns';
import useProjects from '@/utils/useProjects';
import { Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { HeaderGroup, Row, usePagination, useTable } from 'react-table';
import { calculateRankDifference, getRankDifference } from '@/utils/rankUtils';

export default function Rainmakers() {
  const projects = useProjects();
  const [groupedByRainmaker, setGroupedByRainmaker] = useState({});
  const [weeklyRainmakerData, setWeeklyRainmakerData] = useState([]);

  useEffect(() => {
    const fetchHistoricalRainmakerData = async () => {
      if (projects.length === 0) {
        try {
          const response = await fetch(
            'https://socftnkojidkvtmjmyha.supabase.co/storage/v1/object/public/earnings/rainmakers.json'
          );
          if (!response.ok) throw new Error('Error fetching data');

          const jsonData = await response.json();
          setWeeklyRainmakerData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchHistoricalRainmakerData();
  }, [projects, setWeeklyRainmakerData]);

  useEffect(() => {
    const newGroupedByRainmaker = projects.reduce(
      (groups: any, project: any) => {
        const rainmaker = project.fields.Rainmaker;
        if (!groups[rainmaker]) {
          groups[rainmaker] = [];
        }
        groups[rainmaker].push(project);
        return groups;
      },
      {}
    );

    setGroupedByRainmaker(newGroupedByRainmaker);
  }, [projects]);

  const rainmakers: any[] = useMemo(() => {
    const sortedRainmakers = Object.entries(groupedByRainmaker)
      .map(([rainmaker, projects], index) => {
        const rainmadeSum = (projects as any).reduce(
          (sum: number, project: any) => {
            return sum + (project.fields['Total Earnings USD'] || 0);
          },
          0
        );
        return {
          Name: rainmaker,
          USD: rainmadeSum,
        };
      })
      .sort((a: any, b: any) => b.USD - a.USD);

    return sortedRainmakers.map((rainmaker, index) => {
      const currentRank = index + 1;
      const rankDifference = calculateRankDifference(
        rainmaker.Name,
        currentRank,
        weeklyRainmakerData
      );

      return {
        Rank: currentRank,
        Name: rainmaker.Name,
        USD: parseFloat(rainmaker.USD.toFixed(2)).toString(),
        rankDifference: getRankDifference(rankDifference),
      };
    });
  }, [groupedByRainmaker, weeklyRainmakerData]);

  const columns = useMemo(() => rainmakerColumns, []);
  const data: any[] = useMemo(() => rainmakers, [rainmakers]);

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      // @ts-ignore
      { columns: columns, data: data, initialState: { pageSize: 50 } },
      usePagination
    );

  return (
    <>
      <div className="custom-scrollbar z-0 overflow-auto">
        <div className="mx-auto">
          <div className="mx-auto w-[96%]">
            <h1 className="mt-10 text-center text-2xl font-semibold text-white">
              Rainmakers
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
        bg-[#121726] p-2 font-sans md:w-[900px]"
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
      </div>
    </>
  );
}
