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
import { useDatesAndEarnings } from '@/utils/getDatesAndEarnings';
import { useAtom } from 'jotai';
import { projectsAtom } from '@/context/projects';
import useProjects from '@/utils/useProjects';

const moment = require('moment');

interface DatesAndEarnings {
  date: string;
  totalEarnings: number;
}

type TimeFilterButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

const TimeFilterButton = ({
  label,
  isSelected,
  onClick,
}: TimeFilterButtonProps) => (
  <Button
    onClick={onClick}
    variant={isSelected ? 'solid' : 'filled'}
    bgColor={isSelected ? '#2F3B51' : ''}
    color="white"
    _hover={{ backgroundColor: '#2F3B51' }}
  >
    {label}
  </Button>
);

type SelectedOption = 'Last30Days' | 'YTD' | 'Yearly' | 'All';

export default function Home() {
  const projects = useProjects();
  const [chartData, setChartData] = useState<ChartData<'line'>>();

  const [selectedOption, setSelectedOption] =
    useState<SelectedOption>('Last30Days');

  const chartOptions = useMemo<ChartOptions<'line'>>(() => {
    return {
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
    };
  }, []);

  const totalEarningsUSD = projects.reduce((sum: number, project: any) => {
    return sum + (project.fields['Total Earnings USD'] || 0);
  }, 0);
  const getDatesAndEarnings = useDatesAndEarnings(
    selectedOption,
    totalEarningsUSD
  );

  const filteredDatesAndEarnings = useMemo<DatesAndEarnings[]>(() => {
    return getDatesAndEarnings(projects);
  }, [projects, getDatesAndEarnings]);

  useEffect(() => {
    const chartDataDetails = {
      labels: filteredDatesAndEarnings?.map((obj, index) => {
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
    };
    setChartData(chartDataDetails);
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
              <h1 className="mb-12 text-xl font-semibold text-[#DFE4EC]">
                SuperteamDAO Earnings Graph
              </h1>
              <ButtonGroup mb={12}>
                <TimeFilterButton
                  label="30 D"
                  isSelected={selectedOption === 'Last30Days'}
                  onClick={() => setSelectedOption('Last30Days')}
                />
                <TimeFilterButton
                  label="YTD"
                  isSelected={selectedOption === 'YTD'}
                  onClick={() => setSelectedOption('YTD')}
                />
                <TimeFilterButton
                  label="1 Y"
                  isSelected={selectedOption === 'Yearly'}
                  onClick={() => setSelectedOption('Yearly')}
                />
                <TimeFilterButton
                  label="All"
                  isSelected={selectedOption === 'All'}
                  onClick={() => setSelectedOption('All')}
                />
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
