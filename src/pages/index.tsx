import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  ChartData,
  ChartOptions,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';
import { AspectRatio, Button, ButtonGroup } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const moment = require('moment');

interface DatesAndEarnings {
  date: string;
  totalEarnings: number;
}

export default function Home() {
  const [datesAndEarnings, setDatesAndEarnings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [chartData, setChartData] = useState<ChartData<'line'>>();
  const [chartOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: '#4B6181',
        },
      },
      x: {
        ticks: {
          color: '#4B6181',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  });

  const [selectedOption, setSelectedOption] = useState('Last30Days');
  const filteredDatesAndEarnings = useMemo<DatesAndEarnings[]>(() => {
    return getDatesAndEarnings(projects);
  }, [projects, selectedOption]);

  function getDatesAndEarnings(projectsData: any) {
    const groupedByDate = projectsData.reduce((acc: any, obj: any) => {
      const date = obj.fields.Date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(obj);
      return acc;
    }, {});

    let accumulatedEarnings = 0;
    const datesAndEarnings: any = [];

    Object.keys(groupedByDate)
      .sort()
      .forEach((dateString) => {
        const group = groupedByDate[dateString];
        const totalEarnings = group.reduce(
          (sum: any, obj: any) => sum + obj.fields['Total Earnings USD'],
          0
        );
        accumulatedEarnings += totalEarnings;
        datesAndEarnings.push({
          date: moment(dateString, 'YYYY-MM-DD').format(),
          totalEarnings: accumulatedEarnings,
        });
      });

    function resampleData(datesAndEarnings: any, gapInDays: number) {
      const resampledData: any = [];
      let accumulatedEarnings = 0;
      if (datesAndEarnings.length > 0) {
        let currentDate = moment(datesAndEarnings[0].date).startOf('day');
        let nextDate = moment(datesAndEarnings[0].date)
          .startOf('day')
          .add(gapInDays, 'days');

        datesAndEarnings.forEach(
          ({ date, totalEarnings }: { date: any; totalEarnings: number }) => {
            const dateObj = moment(date);
            while (dateObj.isAfter(nextDate)) {
              resampledData.push({
                date: nextDate.format(),
                totalEarnings: accumulatedEarnings,
              });
              currentDate = nextDate;
              nextDate = currentDate.add(gapInDays, 'days');
            }
            accumulatedEarnings = totalEarnings;
          }
        );
      }

      // Handle the last date if it doesn't align with the gap
      if (
        !moment(resampledData[resampledData.length - 1]?.date)?.isSame(
          moment(datesAndEarnings[datesAndEarnings.length - 1]?.date)
        )
      ) {
        resampledData.push({
          date: moment(
            datesAndEarnings[datesAndEarnings.length - 1]?.date
          ).format(),
          totalEarnings: accumulatedEarnings,
        });
      }

      return resampledData;
    }

    const monthData = resampleData(datesAndEarnings, 30);
    const weeklyData = resampleData(datesAndEarnings, 7);
    const threeDayData = resampleData(datesAndEarnings, 3);

    if (selectedOption === 'All') {
      return monthData;
    } else if (selectedOption === 'Yearly') {
      const startDate = moment().subtract(1, 'year').startOf('day');
      const endDate = moment().startOf('day');
      return monthData.filter((obj: DatesAndEarnings) =>
        moment(obj.date).isBetween(startDate, endDate, 'day', '[]')
      );
    } else if (selectedOption === 'YTD') {
      const thisYear = moment().year();
      return weeklyData.filter(
        (obj: DatesAndEarnings) => moment(obj.date).year() === thisYear
      );
    } else if (selectedOption === 'Last30Days') {
      const startDate = moment().subtract(29, 'days').startOf('day');
      const endDate = moment();
      return threeDayData.filter((obj: DatesAndEarnings) =>
        moment(obj.date).isBetween(startDate, endDate, 'day', '[]')
      );
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/projects`);
        const projectsData = await res.json();
        setProjects(projectsData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setChartData({
      labels: filteredDatesAndEarnings.map((obj, index) => {
        const date = moment(obj.date);
        if (selectedOption === 'Last30Days' || selectedOption === 'YTD') {
          return date.format('DD MMM');
        } else if (date.year() === moment().year()) {
          return date.format('MMM');
        } else {
          return date.format('MMM YYYY');
        }
      }),
      datasets: [
        {
          label: '',
          data: filteredDatesAndEarnings.map((obj) => obj.totalEarnings),
          fill: false,
          borderColor: '#F6A50B',
          tension: 0.1,
        },
      ],
    });
  }, [filteredDatesAndEarnings, selectedOption]);

  return (
    <>
      <Head>
        <title>Superteam Earnings</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto w-[96%] max-w-[1300px]">
        <p className="mb-12 text-5xl font-bold text-white">Earnings v3? 🚀🚧</p>
        <Link href="/projects" className="block text-2xl text-white underline">
          projects
        </Link>
        <Link
          href="/rainmakers"
          className="block text-2xl text-white underline"
        >
          rainmakers
        </Link>
        <Link href="/sponsors" className="block text-2xl text-white underline">
          sponsors
        </Link>

        {chartData ? (
          <div className="rounded-lg border border-[#0E1218] bg-[#0F1320] p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-[#DFE4EC]">
                Superteam Earnings Graph
              </h1>
              <ButtonGroup>
                <Button
                  onClick={() => setSelectedOption('All')}
                  variant={selectedOption === 'All' ? 'solid' : 'filled'}
                  bgColor={selectedOption === 'All' ? '#2F3B51' : ''}
                  color="white"
                  _hover={{ backgroundColor: '#2F3B51' }}
                >
                  All
                </Button>
                <Button
                  onClick={() => setSelectedOption('Yearly')}
                  variant={selectedOption === 'Yearly' ? 'solid' : 'filled'}
                  bgColor={selectedOption === 'Yearly' ? '#2F3B51' : ''}
                  color="white"
                  _hover={{ backgroundColor: '#2F3B51' }}
                >
                  1 Y
                </Button>
                <Button
                  onClick={() => setSelectedOption('YTD')}
                  variant={selectedOption === 'YTD' ? 'solid' : 'filled'}
                  bgColor={selectedOption === 'YTD' ? '#2F3B51' : ''}
                  color="white"
                  _hover={{ backgroundColor: '#2F3B51' }}
                >
                  YTD
                </Button>
                <Button
                  onClick={() => setSelectedOption('Last30Days')}
                  variant={selectedOption === 'Last30Days' ? 'solid' : 'filled'}
                  bgColor={selectedOption === 'Last30Days' ? '#2F3B51' : ''}
                  color="white"
                  _hover={{ backgroundColor: '#2F3B51' }}
                >
                  30 D
                </Button>
              </ButtonGroup>
            </div>
            <AspectRatio ratio={2 / 1}>
              <Line data={chartData} options={chartOptions} />
            </AspectRatio>
          </div>
        ) : (
          <div>loading...</div>
        )}
      </div>
    </>
  );
}
