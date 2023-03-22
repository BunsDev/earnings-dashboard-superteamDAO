import React, { useEffect, useState } from 'react';

export default function Tag({ value }: any) {
  let color = '';
  let bgColor = '';

  switch (value) {
    case 'Bounty':
      color = 'text-[#ff61fa] border-[#ff61fa24] bg-[#1f0d26]';
      break;
    case 'Mission ':
      color = 'text-[#00c3f0] border-[#00c3f024] bg-[#132b37]';
      break;
    case 'Instagrant':
      color = 'text-[#14d7a0] border-[#14d7a024] bg-[#162f30]';
      break;
  }

  return (
    <>
      <div
        className={`text-center text-[11px] font-medium ${color} border-2 ${bgColor} rounded-full px-2`}
      >
        {value}
      </div>
    </>
  );
}
