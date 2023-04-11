import moment from 'moment';

interface DatesAndEarnings {
  date: string;
  totalEarnings: number;
}

export function resampleData(
  datesAndEarnings: DatesAndEarnings[],
  gapInDays: number
): DatesAndEarnings[] {
  if (datesAndEarnings.length === 0) {
    return [];
  }

  const resampledData: DatesAndEarnings[] = [];
  let currentDate = moment(datesAndEarnings[0].date).startOf('day');
  let nextDate = currentDate.clone().add(gapInDays, 'days');
  let accumulatedEarnings = 0;

  for (const { date, totalEarnings } of datesAndEarnings) {
    const dateObj = moment(date);

    while (dateObj.isAfter(nextDate)) {
      resampledData.push({
        date: nextDate.format(),
        totalEarnings: accumulatedEarnings,
      });
      currentDate = nextDate;
      nextDate = currentDate.clone().add(gapInDays, 'days');
    }

    accumulatedEarnings = totalEarnings;

    // Add the last date if it's the last iteration and doesn't align with the gap
    if (
      date === datesAndEarnings[datesAndEarnings.length - 1].date &&
      !nextDate.isSame(dateObj)
    ) {
      resampledData.push({ date, totalEarnings: accumulatedEarnings });
    }
  }

  return resampledData;
}
