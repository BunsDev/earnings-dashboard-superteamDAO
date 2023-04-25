import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { projectsAtom } from '@/context/projectsAtom';
import { supabase } from '@/lib/supabase'; // Import supabase

const useProjects = () => {
  const [projects, setProjects] = useAtom(projectsAtom);

  useEffect(() => {
    const fetchData = async () => {
      if (projects.length === 0) {
        try {
          const { data, error } = await supabase.storage
            .from('earnings')
            .download('projects.json');
          if (error) throw error;
          if (data) {
            const jsonData = await new Response(data).json();
            setProjects(jsonData);
          }
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
