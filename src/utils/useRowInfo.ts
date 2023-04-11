import { useAtom } from 'jotai';
import { rowAtom } from '@/context/rowInfo';

export const useRowInfo = () => {
  const [rowInfo, setRowInfo] = useAtom(rowAtom);

  const handleShow = (cell: any) => {
    setRowInfo(cell?.row?.original);
    console.log(rowInfo);
  };

  return { rowInfo, handleShow };
};
