import { useTable, usePagination, HeaderGroup, Row } from 'react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { projectColumns } from '@/constants/columns';
import { useAtom } from 'jotai';
import { earnerAtom } from '@/context/earners';
import { rowAtom } from '@/context/rowInfo';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { getDatabase } from '@/utils/getDatabase';
import useProjects from '@/utils/useProjects';

export default function Projects() {
  const columns = useMemo(() => projectColumns, []);
  const projects = useProjects();
  const data = useMemo(() => projects, [projects]);
  const [earners, setEarners] = useAtom(earnerAtom);
  const [rowInfo, setRowInfo] = useAtom(rowAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data) {
      const fetchEarnerData = async () => {
        const res = await fetch(`/api/earners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projects: data }),
        });

        const earnerData = await res.json();
        const earners = earnerData.earnerData;
        setEarners(earners);
      };

      fetchEarnerData();
    }
  }, [data, setEarners]);

  useEffect(() => {
    setIsModalOpen(!!rowInfo);
  }, [rowInfo]);

  const handleCloseModal = useCallback(() => {
    setRowInfo({});
  }, [setRowInfo]);

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

  const PageNumber: React.FC<{
    pageNumber: number;
    onClick: () => void;
    isActive?: boolean;
  }> = ({ pageNumber, onClick, isActive }) => (
    <li
      className={`w-12 cursor-pointer select-none rounded border py-2 text-center ${
        isActive ? 'border-[#4B6181]' : 'border-[#263040] text-white/70'
      }`}
      onClick={onClick}
    >
      {pageNumber}
    </li>
  );

  return (
    <div className="">
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
          <ModalContent bg="#0e1218" w="80%" px="10%" py="5%" maxW="600px">
            <ModalHeader
              fontSize="2xl"
              fontFamily="Inter"
              className="text-neutral-100"
            >
              {(rowInfo as any).fields.Name}
            </ModalHeader>
            <ModalCloseButton color="#c1c2c3" />
            <ModalBody className="text-lg text-neutral-200" paddingBottom={8}>
              {(rowInfo as any).fields.Currency && (
                <p className="py-6">
                  Currency: {(rowInfo as any).fields.Currency}
                </p>
              )}
              {(rowInfo as any).fields.Date && (
                <p className="py-6">Date: {(rowInfo as any).fields.Date}</p>
              )}
              <p className="py-6">Earner:</p>
              {(rowInfo as any).fields.Rainmaker && (
                <p className="py-6">
                  Rainmaker: {(rowInfo as any).fields.Rainmaker}
                </p>
              )}
              <p className="py-6">Region: </p>
              {(rowInfo as any).fields.Sponsor && (
                <p className="py-6">
                  Sponsor: {(rowInfo as any).fields.Sponsor}
                </p>
              )}
              {(rowInfo as any).fields['Total Earnings USD'] && (
                <p className="py-6">
                  Total Earnings: $
                  {(rowInfo as any).fields['Total Earnings USD']}
                </p>
              )}
              {(rowInfo as any).fields.Type && (
                <p className="py-6">Type: {(rowInfo as any).fields.Type}</p>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/*  */}
      <div className="custom-scrollbar z-0 overflow-auto">
        <div className="mx-auto md:w-[1200px]">
          <div className="mx-auto w-[96%]">
            <h1 className="mt-10 text-2xl font-semibold text-white">
              Projects
            </h1>
            <Box
              w={{ base: 'fit-content', md: '1200px' }}
              py={6}
              px={4}
              mt={8}
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
                              className={`h-20 whitespace-nowrap border-t border-[#21252a] bg-[#101523] p-4 text-sm text-[#DFE4EC] drop-shadow-md first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r md:px-6
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
