import React from 'react';
import Logo from 'svg/logo';
import Link from 'next/link';

export default function Navbar() {
  return (
    <>
      <div className="mx-auto flex w-[96%] max-w-[1300px] justify-between">
        <div className="flex">
          <Logo />
          <Link href="/projects" className="text-white">
            Projects
          </Link>
          <Link href="/rainmakers" className="text-white">
            Rainmaker Leaderboard
          </Link>
          <Link href="/sponsors" className="text-white">
            Sponsor Leaderboard
          </Link>
        </div>
        <div className="flex">
          <p className="text-sm font-semibold text-[#9EAEC7]">
            Total Earnings:
          </p>
          <p className="text-sm font-semibold text-[#9EAEC7]">
            Total Projects:
          </p>
        </div>
      </div>
    </>
  );
}
