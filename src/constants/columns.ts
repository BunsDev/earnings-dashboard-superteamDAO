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
  },
  {
    Header: 'Type',
    accessor: 'Type',
  },
  {
    Header: 'Rainmaker',
    accessor: 'Rainmaker',
  },
  {
    Header: 'Date Given',
    accessor: 'Date Given',
  },
  {
    Header: 'Country/Region',
    accessor: 'Country/Region',
  },
  {
    Header: 'Token',
    accessor: 'Token',
  },
  {
    Header: 'USD',
    accessor: 'Total Earnings USD',
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
