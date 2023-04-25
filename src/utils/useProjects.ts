import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { projectsAtom } from '@/context/projectsAtom';

const useProjects = () => {
  const [projects, setProjects] = useAtom(projectsAtom);
  const projectsUrl =
    'https://socftnkojidkvtmjmyha.supabase.co/storage/v1/object/public/earnings/projects.json';

  useEffect(() => {
    const fetchData = async () => {
      if (projects.length === 0) {
        try {
          const response = await fetch(projectsUrl);
          if (!response.ok) throw new Error('Error fetching data');

          const jsonData = await response.json();
          setProjects(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [projects, setProjects]);

  return projects;
};

export default useProjects;
