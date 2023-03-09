import Tag from '@/components/Tag';
import { Usdc, Usdt, Bonk, Solana } from '@/dynamic/coins';
import { India, Vietnam, Turkey, Germany } from '@/dynamic/countries';
import overflowText from '@/utils/overflow';

export const projectColumns = [
  {
    id: 'id',
    Cell: ({ row, flatRows }: any) => {
      return flatRows.indexOf(row) + 1;
    },
  },
  {
    Header: 'Project',
    accessor: 'Project',
    Cell: ({ value }: { value: string }) => {
      if (value) {
        return <p>{overflowText(value, 42)}</p>;
      }
    },
  },
  {
    // Header: 'Type',
    accessor: 'Type',
    Cell: ({ value }: { value: any }) => {
      if (value) {
        return <Tag value={value} />;
      }
    },
  },
  {
    // Header: 'Token',
    accessor: 'Token',
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
    accessor: 'Total Earnings USD',
    Cell: ({ value }: { value: string }) => {
      return <span>${value}</span>;
    },
  },
  {
    Header: 'Rainmaker',
    accessor: 'Rainmaker',
  },
  {
    // Header: 'Country',
    accessor: 'Country/Region',
    Cell: ({ value }: { value: string }) => {
      if (value === 'India') {
        return <India />;
      }
      if (value === 'Vietnam') {
        return <Vietnam />;
      }
      if (value === 'Turkey') {
        return <Turkey />;
      }
      if (value === 'Germany') {
        return <Germany />;
      }
    },
  },
  {
    Header: 'Date Given',
    accessor: 'Date Given',
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
  },
];
