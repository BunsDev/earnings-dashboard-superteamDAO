import Tag from '@/components/Tag';
import { earnerAtom } from '@/context/earners';
import { rainmakersAtom } from '@/context/rainmakers';
import { rowAtom } from '@/context/rowInfo';
import { sponsorAtom } from '@/context/sponsors';
import { Usdc, Usdt, Bonk, Solana } from '@/dynamic/coins';
import { India, Vietnam, Turkey, Germany, Mexico } from '@/dynamic/countries';
import overflowText from '@/utils/overflow';
import { useAtom } from 'jotai';
import { useState } from 'react';

export const projectColumns = [
  {
    id: 'id',
    Cell: ({ row, flatRows }: any) => {
      return (
        <p className="text-sm text-neutral-400">{flatRows.indexOf(row) + 1}</p>
      );
    },
  },
  {
    Header: 'Project',
    accessor: 'fields.Name',
    Cell: (props: any) => {
      const [rowInfo, setRowInfo] = useAtom(rowAtom);
      const handleShow = (cell: any) => {
        setRowInfo(cell?.row?.original);
        console.log(rowInfo);
      };
      return (
        <p
          onClick={() => handleShow(props)}
          className="cursor-pointer text-white transition-all duration-500 hover:underline"
        >
          {overflowText(props.value, 42)}
        </p>
      );
    },
  },
  {
    // Header: 'Type',
    accessor: 'fields.Type',
    Cell: Tag,
  },
  {
    Header: 'Earners',
    accessor: 'fields.Earner',
    Cell: ({ value }: { value: [] }) => {
      const [earner] = useAtom(earnerAtom);
      if (value) {
        const names = value.slice(0, 2).map((key) => earner[key]);
        const numAdditionalEarners = value.length - names.length;
        console;
        return (
          <div className="">
            {names.map((name, index) => (
              <p key={index} className="text-sm font-semibold text-neutral-200">
                {name}
              </p>
            ))}
            <p className="text-xs font-semibold text-neutral-400">
              {numAdditionalEarners ? '+' + numAdditionalEarners : null}
            </p>
          </div>
        );
      }
    },
  },
  {
    // Header: 'Token',
    accessor: 'fields.Currency',
    width: 16,
    Cell: ({ value }: { value: string }) => {
      if (value === 'USDC') {
        return <Usdc />;
      }
      if (value === 'USDT') {
        return <Usdt />;
      }
      if (value === 'BONK') {
        return <Bonk />;
      }
      if (value === 'SOL') {
        return <Solana />;
      } else {
        return <p className="text-center text-[10px] font-light">{value}</p>;
      }
    },
  },
  {
    Header: 'USD',
    accessor: 'fields.Total Earnings USD',
    Cell: ({ value }: { value: any }) => {
      if (value) {
        const numString = value.toLocaleString();
        if (value < 0) {
          return (
            <p className="text-right font-medium text-[#f83b31]">
              <span>-${numString.substring(1)}</span>
            </p>
          );
        } else
          return (
            <p className="text-right font-medium">
              <span>${numString}</span>
            </p>
          );
      }
    },
    getProps: (rowInfo: any) => {
      if (rowInfo?.row?.fields['Total Earnings USD'] < 0) {
        return {
          style: {
            background: 'red',
          },
        };
      }
    },
  },
  {
    // Header: 'Rainmaker',
    accessor: 'fields.Rainmaker',
    // Cell: ({ value }: { value: string }) => {
    //   return <p className="text-sm uppercase">{value}</p>;
    // },
  },
  {
    // Header: 'Country',
    accessor: 'fields.Region',
    Cell: ({ value }: { value: string }) => {
      if (value == 'reckMKOOQ59TFRk6n') {
        return <India />;
      }
      if (value == 'recJXKIOEDvUjIv9Z') {
        return <Vietnam />;
      }
      if (value == 'reciIV94eES6oiIY2') {
        return <Turkey />;
      }
      if (value == 'recEdv0ihUicz158R') {
        return <Germany />;
      }
      if (value == 'recQuDC0wLiJCdTiH') {
        return <Mexico />;
      }
    },
  },
  {
    Header: 'Date Given',
    accessor: 'fields.Date',
    Cell: ({ value }: { value: string }) => {
      return <p className="text-sm">{value}</p>;
    },
  },
  {
    accessor: 'fields.Sponsor',
    // Cell: ({ value }) => {
    //   <p>{value}</p>;
    // },
  },
];

export const rainmakerColumns = [
  {
    id: 'id',
    Header: '📈',
    Cell: ({ row, flatRows }: any) => {
      return (
        <p className="text-sm text-neutral-400">{flatRows.indexOf(row) + 1}</p>
      );
    },
  },
  {
    Header: 'Rainmaker',
    accessor: 'Name',
    Cell: ({ value }: { value: string }) => {
      const [rainmaker, setRainmaker] = useAtom(rainmakersAtom);

      const handleSponsorClick = async () => {
        try {
          const res = await fetch(
            `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE}/${process.env.NEXT_PUBLIC_AIRTABLE_TABLE}?filterByFormula=Rainmaker="${value}"`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}`,
              },
            }
          );
          const data = await res.json();
          setRainmaker(data.records);
          console.log(rainmaker);
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <p
          className="cursor-pointer text-white transition-all duration-500 hover:underline"
          onClick={handleSponsorClick}
        >
          {value}
        </p>
      );
    },
  },
  {
    Header: 'USD',
    accessor: 'USD',
    Cell: ({ value }: { value: any }) => {
      if (value) return <span>$ {value}</span>;
    },
  },
  // {
  //   Header: '',
  //   id: 'button',
  //   // accessor: 'USD',
  //   Cell: () => {
  //     return (
  //       <span>
  //         <p className="text-xs">View Recent Projects</p>
  //       </span>
  //     );
  //   },
  // },
];

export const sponsorColumns = [
  {
    id: 'id',
    Header: '📈',
    Cell: ({ row, flatRows }: any) => {
      return (
        <p className="text-sm text-neutral-400">{flatRows.indexOf(row) + 1}</p>
      );
    },
  },
  {
    Header: 'Sponsor',
    accessor: 'Name',
    Cell: ({ value }: { value: string }) => {
      const [sponsor, setSponsor] = useAtom(sponsorAtom);

      const handleSponsorClick = async () => {
        try {
          const res = await fetch(
            `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_AIRTABLE_BASE}/${process.env.NEXT_PUBLIC_AIRTABLE_TABLE}?filterByFormula=Sponsor="${value}"`,
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}`,
              },
            }
          );
          const data = await res.json();
          setSponsor(data.records);
          console.log(sponsor);
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <p
          className="cursor-pointer text-white transition-all duration-500 hover:underline"
          onClick={handleSponsorClick}
        >
          {value}
        </p>
      );
    },
  },
  {
    Header: 'USD',
    accessor: 'USD',
    Cell: ({ value }: any) => {
      if (value) return <span>$ {value}</span>;
    },
  },
];
