import { useTable, usePagination, HeaderGroup, Row } from 'react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { projectColumns } from '@/constants/columns';
import { useAtom, useAtomValue } from 'jotai';
import { earnerAtom } from '@/context/earnerAtom';
import { rowAtom } from '@/context/rowInfoAtom';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { PageNumber } from '@/components/PageNumber';
import Head from 'next/head';
import axios from 'axios';
import { projectsAtom } from '@/context/projectsAtom';

export default function Projects() {
  const columns = useMemo(() => projectColumns, []);
  const projects = useAtomValue(projectsAtom);

  const data = useMemo(() => projects, [projects]);
  const [earners, setEarners] = useAtom(earnerAtom);
  const [rowInfo, setRowInfo] = useAtom(rowAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const fetchEarnerData = async () => {
        try {
          const response = await axios.post('/api/earners', {
            projects: data,
          });
          const earners = response.data.earnerData;
          setEarners(earners);
        } catch (error: any) {
          console.error('Error fetching data:', error.message);
        }
      };

      fetchEarnerData();
      const regions: Record<string, string> = {
        reckMKOOQ59TFRk6n: 'India',
        recJXKIOEDvUjIv9Z: 'Vietnam',
        reciIV94eES6oiIY2: 'Turkey',
        recEdv0ihUicz158R: 'Germany',
        recQuDC0wLiJCdTiH: 'Mexico',
        recw7ExFk21ttX8KT: 'UK',
      };

      let totalEarnings = data.reduce(
        (total: Record<string, number>, item: any) => {
          if (
            item.fields.Region &&
            item.fields.Region.length > 0 &&
            regions[item.fields.Region[0] as keyof typeof regions]
          ) {
            if (typeof item.fields['Total Earnings USD'] === 'number') {
              if (
                !total[regions[item.fields.Region[0] as keyof typeof regions]]
              ) {
                total[
                  regions[item.fields.Region[0] as keyof typeof regions]
                ] = 0;
              }
              total[regions[item.fields.Region[0] as keyof typeof regions]] +=
                item.fields['Total Earnings USD'];
            }
          }
          return total;
        },
        {}
      );
      console.log(totalEarnings);
    }
  }, [data, setEarners]);

  useEffect(() => {
    setIsModalOpen(!!rowInfo);
  }, [rowInfo]);

  const handleCloseModal = useCallback(() => {
    setRowInfo({});
  }, [setRowInfo]);

  const earnerKeys = (rowInfo as any)?.fields?.Earner;
  const earnerNames = earnerKeys?.map((key: number) => earners[key]) ?? [];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
    pageOptions,
    gotoPage,
    state,
  } = useTable(
    {
      // @ts-ignore
      columns: columns,
      data: data,
      initialState: {
        pageSize: 15,
        hiddenColumns: ['fields.Sponsor', 'fields.Rainmaker'],
      },
    },
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

  type RegionMapping = {
    [key: string]: string;
  };

  const regionMapping: RegionMapping = {
    reckMKOOQ59TFRk6n: 'India',
    recJXKIOEDvUjIv9Z: 'Vietnam',
    reciIV94eES6oiIY2: 'Turkey',
    recEdv0ihUicz158R: 'Germany',
    recQuDC0wLiJCdTiH: 'Mexico',
    recw7ExFk21ttX8KT: 'UK',
  };

  return (
    <div className="">
      <Head>
        <title>Projects | Superteam Earnings</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* there's a glitch in the table that only allows colors present in the codebase to be rendered, this section is to render those colors  */}
      <p className="hidden text-right text-xs font-semibold text-[#f83b31] transition-all duration-500 hover:underline">
        hello
      </p>
      <p className="hidden cursor-pointer text-xs font-medium text-neutral-400">
        hello
      </p>

      {rowInfo && Object.keys(rowInfo).length > 0 && (
        <Modal isOpen={!!rowInfo} onClose={handleCloseModal} size="4xl">
          <ModalOverlay />
          <ModalContent
            bg="#14192A"
            w="80%"
            px="32px"
            py="52px"
            maxW="480px"
            borderRadius="2xl"
          >
            <ModalHeader
              fontSize="2xl"
              fontFamily="Inter"
              className="text-neutral-100"
            >
              <p>{(rowInfo as any).fields.Name}</p>
            </ModalHeader>
            <ModalCloseButton color="#c1c2c3" />
            <ModalBody className="text-lg text-neutral-200" paddingBottom={8}>
              <div className="flex justify-between">
                <div>
                  {(rowInfo as any).fields.Currency && (
                    <>
                      <p className="mt-6 text-sm text-white">CURRENCY</p>
                      <p className="text-lg font-medium text-white">
                        {(rowInfo as any).fields.Currency}
                      </p>
                    </>
                  )}
                  {(rowInfo as any).fields.Date && (
                    <>
                      <p className="mt-6 text-sm text-white">DATE</p>
                      <p className="text-lg font-medium text-white">
                        {(rowInfo as any).fields.Date}
                      </p>
                    </>
                  )}
                  {(rowInfo as any).fields.Earner && (
                    <>
                      <p className="mt-6 text-sm text-white">EARNER</p>
                      {earnerNames.map((name: string, index: number) => (
                        <p
                          key={index}
                          className="text-lg font-medium text-white"
                        >
                          {name}
                        </p>
                      ))}
                    </>
                  )}
                  {(rowInfo as any).fields.Rainmaker && (
                    <>
                      <p className="mt-6 text-sm text-white">RAINMAKER</p>
                      <p className="text-lg font-medium text-white">
                        {(rowInfo as any).fields.Rainmaker}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  {(rowInfo as any).fields.Region && (
                    <>
                      <p className="mt-6 text-sm text-white">COUNTRY</p>
                      <p className="text-lg font-medium text-white">
                        {regionMapping[(rowInfo as any).fields.Region[0]]}
                      </p>
                    </>
                  )}
                  {(rowInfo as any).fields.Sponsor && (
                    <>
                      <p className="mt-6 text-sm text-white">SPONSOR</p>
                      <p className="text-lg font-medium text-white">
                        {(rowInfo as any).fields.Sponsor}
                      </p>
                    </>
                  )}
                  {(rowInfo as any).fields['Total Earnings USD'] && (
                    <>
                      <p className="mt-6 text-sm text-white">TOTAL EARNINGS</p>
                      <p className="text-lg font-medium text-white">
                        ${(rowInfo as any).fields['Total Earnings USD']}
                      </p>
                    </>
                  )}
                  {(rowInfo as any).fields.Type && (
                    <>
                      <p className="mt-6 text-sm text-white">TYPE</p>
                      <p className="text-lg font-medium text-white">
                        {(rowInfo as any).fields.Type}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/*  */}
      <div className="custom-scrollbar z-0 overflow-auto">
        <div className="mx-auto md:min-w-[1200px]">
          <div className="mx-auto w-[96%]">
            <h1 className="mt-10 text-center text-2xl font-semibold text-white">
              Projects
            </h1>
            <Box
              minW={{ base: '100%', md: '1200px' }}
              w={{ base: 'fit-content', md: 'fit-content' }}
              py={{ base: 1, lg: 1 }}
              px={{ base: 1, lg: 1 }}
              mt={8}
              mx="auto"
              rounded="lg"
              bg="#121726"
              boxShadow="0px 2px 1px rgba(255, 255, 255, 0.08), inset 0px 2px 4px rgba(0, 0, 0, 0.48)"
              // display={{ base: 'none', md: 'flex' }}
            >
              <table
                {...getTableProps}
                className=" mx-auto table-auto border-separate border-spacing-y-3 border-0 bg-[#121726]
        p-2 font-sans"
              >
                <thead className="sticky top-0 z-[500]">
                  {headerGroups.map((headerGroup: HeaderGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                      {headerGroup.headers.map((column, i) => (
                        <th
                          key={i}
                          {...column.getHeaderProps}
                          className={`m-0 bg-[#191F34] px-4 py-6 text-left text-sm font-medium
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
                              className={`h-[4.5rem] whitespace-nowrap border-t border-[#21252a] bg-[#101523] p-4 text-sm text-[#DFE4EC] drop-shadow-md first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r md:px-6
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
            </Box>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-[96%] max-w-[1200px] justify-between py-16 text-white">
        <div className="flex items-center">
          Showing {entriesStart}-{entriesEnd} out of {totalEntries} entries
        </div>
        <ul className="flex items-center justify-center gap-4 text-white">
          {currentPage > 2 && (
            <>
              <PageNumber pageNumber={1} onClick={() => handlePageChange(1)} />
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
  );
}
