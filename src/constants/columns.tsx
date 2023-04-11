import Tag from '@/components/Tag';
import { earnerAtom } from '@/context/earners';
import { rainmakersAtom } from '@/context/rainmakers';
import { rowAtom } from '@/context/rowInfo';
import { sponsorAtom } from '@/context/sponsors';
import { getCoin } from '@/utils/getCoin';
import { getCountry } from '@/utils/getCountry';
import overflowText from '@/utils/overflow';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

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
    accessor: 'fields.Type',
    Cell: Tag,
  },
  {
    Header: 'Earners',
    accessor: 'fields.Earner',
    Cell: (props: any) => {
      const [earner] = useAtom<any>(earnerAtom);
      const [rowInfo, setRowInfo] = useAtom(rowAtom);
      const handleShow = useCallback(
        (cell: any) => {
          setRowInfo(cell?.row?.original);
          console.log(rowInfo);
        },
        [setRowInfo, rowInfo]
      );
      const value = props.value;

      const names = useMemo(() => {
        return value?.slice(0, 2).map((key: number) => earner[key]) ?? [];
      }, [value, earner]);
      const numAdditionalEarners = value?.length - names.length;
      return useMemo(
        () => (
          <div className="">
            {names.map((name: string, index: number) => (
              <p key={index} className="text-sm font-semibold text-neutral-200">
                {name}
              </p>
            ))}
            <p
              className="cursor-pointer text-xs font-semibold text-neutral-400 hover:underline"
              onClick={() => handleShow(props)}
            >
              {numAdditionalEarners ? '+' + numAdditionalEarners : null}
            </p>
          </div>
        ),
        [names, numAdditionalEarners, handleShow, props]
      );
    },
  },
  {
    accessor: 'fields.Currency',
    width: 16,
    Cell: ({ value }: { value: string }) => getCoin(value),
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
    accessor: 'fields.Rainmaker',
  },
  {
    accessor: 'fields.Region',
    Cell: ({ value }: { value: string }) => getCountry(value),
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
