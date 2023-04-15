// hooks/useEarnerData.ts
import { useEffect, useState } from 'react';

const useEarnerData = () => {
  const [earnerData, setEarnerData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/earners');
        const earners = await res.json();
        const earnersObj = earners.reduce(
          (acc: { [key: string]: any }, earner: any) => {
            acc[earner.id] = earner.Title;
            return acc;
          },
          {}
        );

        setEarnerData(earnersObj);
      } catch (error) {
        console.error('Error fetching earner data:', error);
      }
    };

    fetchData();
  }, []);

  return earnerData;
};

export default useEarnerData;
