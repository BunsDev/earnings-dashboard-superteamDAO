import React, { useEffect, useState } from 'react';

export default function Tag({ value }: any) {
  let color = '';
  let bgColor = '';

  switch (value) {
    case 'Bounty':
      color = 'text-[#F6A50B] border-[#F6A50B] bg-[#312B1F]';
      break;
    case 'Mission':
      color = 'text-[#00A9D0] border-[#00A9D0] bg-[#132b37]';
      break;
    case 'Instagrant':
      color = 'text-[#F000E8] border-[#F000E8] bg-[#2E1738]';
      break;
  }

  return (
    <>
      <div
        className={`text-[10px] text-center font-light ${color} border ${bgColor} px-2 rounded-full`}
      >
        {value}
      </div>
    </>
  );
}
