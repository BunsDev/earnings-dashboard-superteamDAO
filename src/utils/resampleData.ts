import moment from 'moment';

interface DatesAndEarnings {
  date: string;
  totalEarnings: number;
}

export function resampleData(
  datesAndEarnings: DatesAndEarnings[],
  gapInDays: number,
  totalEarningsUSD: number
): DatesAndEarnings[] {
  if (datesAndEarnings.length === 0) {
    return [];
  }

  const resampledData: DatesAndEarnings[] = [];
  let currentDate = moment(datesAndEarnings[0].date).startOf('day');
  let nextDate = currentDate.clone().add(gapInDays, 'days');
  let accumulatedEarnings = 0;
  const lastDate = datesAndEarnings[datesAndEarnings.length - 1];

  for (const { date, totalEarnings } of datesAndEarnings) {
    const dateObj = moment(date);

    while (dateObj.isAfter(nextDate)) {
      if (nextDate.isValid() && accumulatedEarnings !== null) {
        resampledData.push({
          date: nextDate.format(),
          totalEarnings: accumulatedEarnings,
        });
      }
      currentDate = nextDate;
      nextDate = currentDate.clone().add(gapInDays, 'days');
    }

    accumulatedEarnings = totalEarnings;

    if (date === lastDate.date && !nextDate.isSame(dateObj)) {
      if (dateObj.isValid() && accumulatedEarnings !== null) {
        resampledData.push({ date, totalEarnings: accumulatedEarnings });
      }
    }
  }

  const today = moment().startOf('day');

  return resampledData;
}
