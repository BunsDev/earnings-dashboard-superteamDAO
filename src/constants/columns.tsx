import Tag from '@/components/Tag';
import { earnerAtom } from '@/context/earners';
import { Usdc, Usdt, Bonk, Solana } from '@/dynamic/coins';
import { India, Vietnam, Turkey, Germany } from '@/dynamic/countries';
import overflowText from '@/utils/overflow';
import { useAtom } from 'jotai';
import { CellProps, Column } from 'react-table';

export const projectColumns = [
  {
    id: 'id',
    Cell: ({ row, flatRows }: any) => {
      return flatRows.indexOf(row) + 1;
    },
  },
  {
    Header: 'Project',
    accessor: 'fields.Name',
    Cell: ({ value }: { value: string }) => {
      return <p className="font-bold">{overflowText(value, 42)}</p>;
    },
  },
  {
    // Header: 'Type',
    accessor: 'fields.Type',
    Cell: ({ value }: { value: any }) => {
      if (value) {
        return <Tag value={value} />;
      }
    },
  },
  {
    Header: 'Earners',
    accessor: 'fields.Earner',
    Cell: ({ value }: { value: [] }) => {
      if (value) {
        const [earner] = useAtom(earnerAtom);
        const names = value.map((key) => earner[key]);
        console;
        return (
          <div className="">
            {names.map((name, index) => (
              <p key={index} className="text-sm">
                {name}
              </p>
            ))}
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
        if (value?.toString().substring(0, 1) === '-') {
          return (
            <p className="text-right text-red-800">
              <span>- ${value.toString().substring(1)}</span>
            </p>
          );
        } else
          return (
            <p className="text-right">
              <span>${value}</span>
            </p>
          );
      }
    },
  },
  {
    Header: 'Rainmaker',
    accessor: 'fields.Rainmaker',
    Cell: ({ value }: { value: string }) => {
      return <p className="text-sm uppercase">{value}</p>;
    },
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
      } else return <p>{value}</p>;
    },
  },
  {
    Header: 'Date Given',
    accessor: 'fields.Date',
    Cell: ({ value }: { value: string }) => {
      return <p className="text-sm">{value}</p>;
    },
  },
];

export const rainmakerColumns = [
  {
    Header: 'Rainmaker',
    accessor: 'Name',
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
    Header: 'Sponsor',
    accessor: 'Name',
  },
  {
    Header: 'USD',
    accessor: 'USD',
    Cell: ({ value }: any) => {
      if (value) return <span>$ {value}</span>;
    },
  },
];
