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
];
