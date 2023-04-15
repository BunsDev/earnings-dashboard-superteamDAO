import { useTable, usePagination, HeaderGroup, Row } from 'react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { projectColumns } from '@/constants/columns';
import cache from '@/utils/cache';
import { useAtom } from 'jotai';
import { earnerAtom } from '@/context/earners';
import { rowAtom } from '@/context/rowInfo';
import {
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

  const { pageIndex } = state;

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
        <div className="mx-auto w-[900px] md:w-[1280px]">
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
