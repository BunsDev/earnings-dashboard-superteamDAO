import React from 'react';

export default function Tag({ value }: any) {
  let color = '';
  let bgColor = '';

  let displayValue = '';

  switch (value) {
    case 'Bounty':
    case 'Permissionless Bounty':
      displayValue = 'Bounty';
      color = 'text-[#ff61fa] border-[#ff61fa24] bg-[#1f0d26]';
      break;
    case 'Mission':
    case 'Permissioned Bounty':
    case 'Contract':
    case 'Project':
      displayValue = 'Contract';
      color = 'text-[#00c3f0] border-[#00c3f024] bg-[#132b37]';
      break;
    case 'Instagrant':
    case 'Grant':
      displayValue = 'Grant';
      color = 'text-[#14d7a0] border-[#14d7a024] bg-[#162f30]';
      break;
    case 'Misc. Expense':
      displayValue = value;
      color = 'text-[#A3A5FF] border-[#A3A5FF24] bg-[#131839]';
      break;
    case 'Job':
      displayValue = value;
      color = 'text-[#FF75AF] border-[#FF75AF24] bg-[#210D1C]';
      break;
    case 'Hackathon Award':
      displayValue = value;
      color = 'text-[#A3F000] border-[#A3F00024] bg-[#233300]';
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
