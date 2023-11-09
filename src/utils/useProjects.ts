import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { projectsAtom } from '@/context/projectsAtom';
import axios from 'axios';

const useProjects = () => {
  const [projects, setProjects] = useAtom(projectsAtom);

  useEffect(() => {
    const fetchData = async () => {
      if (projects.length === 0) {
        try {
          const response = await axios.get('/api/get-projects');
          setProjects(response.data);
        } catch (error: any) {
          console.error('Error fetching data:', error.message);
        }
      }
    };

    fetchData();
  }, [projects, setProjects]);

  return projects;
};

export default useProjects;
