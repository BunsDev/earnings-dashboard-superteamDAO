import React from 'react';

export default function Tag({ value }: any) {
  let color = '';
  let bgColor = '';

  let displayValue = '';

  switch (value) {
    case 'Pizza Fund':
      displayValue = value;
      color = 'text-[#F8B535] border-[#F8B53524] bg-[#3d2900]';
      break;
    case 'Bounty':
    case 'Permissionless Bounty':
      displayValue = 'Permissionless Bounty';
      color = 'text-[#ff61fa] border-[#ff61fa24] bg-[#1f0d26]';
      break;
    case 'Mission':
    case 'Permissioned Bounty':
      displayValue = 'Permissioned Bounty';
      color = 'text-[#00c3f0] border-[#00c3f024] bg-[#132b37]';
      break;
    case 'Instagrant':
      displayValue = value;
      color = 'text-[#14d7a0] border-[#14d7a024] bg-[#162f30]';
      break;
  }

  if (value) {
    return (
      <>
        <div
          className={`text-center text-[11px] font-medium ${color} border-2 ${bgColor} rounded-full px-2`}
        >
          {displayValue}
        </div>
      </>
    );
  }
}
