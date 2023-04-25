import React from 'react';

interface Props {
  pageNumber: number;
  onClick: () => void;
  isActive?: boolean;
}

export const PageNumber = ({ pageNumber, onClick, isActive }: Props) => {
  const activeClass = isActive
    ? 'border-[#4B6181]'
    : 'border-[#263040] text-white/70';
  return (
    <li
      className={`w-12 cursor-pointer select-none rounded border py-2 text-center ${activeClass}`}
      onClick={onClick}
    >
      {pageNumber}
    </li>
  );
};
