import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { projectsAtom } from '@/context/projectsAtom';

const useProjects = () => {
  const [projects, setProjects] = useAtom(projectsAtom);

  useEffect(() => {
    const fetchData = async () => {
      if (projects.length === 0) {
        try {
          const res = await fetch('/projects.json');
          const data: any[] = await res.json();
          setProjects(data);
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
