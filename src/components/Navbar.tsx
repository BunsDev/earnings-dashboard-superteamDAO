import React from 'react';
import Logo from 'svg/logo';
import Link from 'next/link';
import useProjects from '@/utils/useProjects';
import { useRouter } from 'next/router';

export default function Navbar() {
  const projects = useProjects();
  const totalNumberOfProjects = projects.length;

  const totalEarningsUSD = projects.reduce((sum: number, project: any) => {
    return sum + (project.fields['Total Earnings USD'] || 0);
  }, 0);
  const router = useRouter();
  return (
    <>
      <div className="border-b border-[#1C2430] py-7">
        <div className="mx-auto flex w-[96%] max-w-[1300px] items-center">
          <div className="flex w-full items-center gap-8">
            <div
              className="mr-6 h-[21px] w-[159px] cursor-pointer"
              onClick={() => router.push('/')}
            >
              <Logo />
            </div>

            <Link href="/projects" className="text-white">
              <p>Projects</p>
            </Link>
            <Link href="/rainmakers" className="text-white">
              Rainmakers
            </Link>
            <Link href="/sponsors" className="text-white">
              <p>Sponsors</p>
            </Link>
          </div>
          <div className="flex gap-8 whitespace-nowrap">
            <p className="text-sm font-semibold text-[#9EAEC7]">
              Total Earnings:{' '}
              <span className="text-[#F6A50B]">${totalEarningsUSD}</span>
            </p>
            <p className="text-sm font-semibold text-[#9EAEC7]">
              Total Projects:{' '}
              <span className="text-[#F6A50B]">{totalNumberOfProjects}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
