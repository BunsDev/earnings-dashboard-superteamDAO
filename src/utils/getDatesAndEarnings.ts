import { useCallback } from 'react';
import { resampleData } from './resampleData';
import moment from 'moment';

interface Project {
  fields: {
    Date: string;
    'Total Earnings USD': number;
  };
}

interface DatesAndEarnings {
  date: string;
  totalEarnings: number;
}

type SelectedOption = 'Yearly' | 'YTD' | 'Last30Days' | 'All';

export const useDatesAndEarnings = (
  selectedOption: SelectedOption,
  totalEarningsUSD: number
) => {
  const getDatesAndEarnings = useCallback(
    (projectsData: Project[]) => {
      const groupedByDate = projectsData.reduce(
        (acc: Record<string, Project[]>, obj: Project) => {
          if ('Total Earnings USD' in obj.fields) {
            const date = obj.fields.Date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(obj);
          }
          return acc;
        },
        {}
      );

      let accumulatedEarnings = 0;
      const datesAndEarnings: DatesAndEarnings[] = Object.keys(groupedByDate)
        .sort()
        .map((dateString) => {
          const group = groupedByDate[dateString];
          const totalEarnings = group.reduce(
            (sum, obj) => sum + obj.fields['Total Earnings USD'],
            0
          );
          accumulatedEarnings += totalEarnings;
          return {
            date: moment(dateString, 'YYYY-MM-DD').format(),
            totalEarnings: accumulatedEarnings,
          };
        });

      console.log(datesAndEarnings);

      const monthData = resampleData(datesAndEarnings, 30, totalEarningsUSD);
      const weeklyData = resampleData(datesAndEarnings, 7, totalEarningsUSD);
      const threeDayData = resampleData(datesAndEarnings, 3, totalEarningsUSD);
      console.log(threeDayData);

      const filterData = (
        data: DatesAndEarnings[],
        start: moment.Moment,
        end: moment.Moment
      ) =>
        data.filter((obj) =>
          moment(obj.date).isBetween(start, end, 'day', '[]')
        );

      switch (selectedOption) {
        case 'Yearly': {
          const startDate = moment().subtract(1, 'year').startOf('day');
          const endDate = moment().startOf('day');
          return filterData(monthData, startDate, endDate);
        }
        case 'YTD': {
          const thisYear = moment().year();
          return weeklyData.filter(
            (obj) => moment(obj.date).year() === thisYear
          );
        }
        case 'Last30Days': {
          const start = moment().subtract(29, 'days').startOf('day');
          const end = moment();
          return filterData(threeDayData, start, end);
        }
        default:
          return monthData;
      }
    },
    [selectedOption, totalEarningsUSD]
  );

  return getDatesAndEarnings;
};
