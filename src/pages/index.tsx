import Head from 'next/head';
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
import { AspectRatio, Box, Button, ButtonGroup } from '@chakra-ui/react';

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
    fontSize={{ base: 'xs', md: 'md' }}
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
            callback: (value: any) => {
              if (value >= 1e6) {
                return '$' + (value / 1e6).toFixed(2) + 'M';
              } else if (value >= 1e3) {
                return '$' + value / 1e3 + 'k';
              } else {
                return '$' + value;
              }
            },
          },
          grid: {
            color: '#121726',
          },
        },
        x: {
          ticks: {
            color: '#4B6181',
          },
          grid: {
            color: '#121726',
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
    const dateLabelMap: { [key: string]: number } = {};

    filteredDatesAndEarnings?.forEach((obj) => {
      const date = moment(obj.date);
      let newLabel = '';
      if (selectedOption === 'Last30Days' || selectedOption === 'YTD') {
        newLabel = date.format('DD MMM');
      } else if (date.year() === moment().year()) {
        newLabel = date.format('MMM');
      } else {
        newLabel = date.format('MMM YYYY');
      }

      dateLabelMap[newLabel] = obj.totalEarnings;
    });

    const labels = Object.keys(dateLabelMap);
    const data = Object.values(dateLabelMap);

    const chartDataDetails = {
      labels,
      datasets: [
        {
          label: '',
          data,
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
      <div className="mx-auto w-[96%] max-w-[1200px] pt-4">
        <h1 className="my-6 text-3xl font-semibold text-white">
          Superteam Earnings Dashboard
        </h1>
        {chartData ? (
          <Box
            rounded="md"
            border="1px"
            bg="#0F1320"
            p={{ base: 4, lg: 8 }}
            mb={16}
            borderColor="#0E1218"
            boxShadow="0px 2px 1px rgba(255, 255, 255, 0.08), inset 0px 2px 4px rgba(0, 0, 0, 0.48)"
          >
            <div className="mb-12 flex flex-col items-center justify-between lg:flex-row">
              <ButtonGroup>
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
          </Box>
        ) : (
          <div>loading...</div>
        )}
      </div>
    </>
  );
}
