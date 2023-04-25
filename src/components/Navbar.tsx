/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import Logo from '@/svgs/logo';
import useProjects from '@/utils/useProjects';
import { useRouter } from 'next/router';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Stack,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionIconButton = motion(IconButton);
const MotionBox = motion(Box);

export default function Navbar() {
  const projects = useProjects();
  const totalNumberOfProjects = projects.length;
  const totalEarningsUSD = projects
    .reduce((sum: number, project: any) => {
      return sum + (project.fields['Total Earnings USD'] || 0);
    }, 0)
    .toFixed(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const navLinksVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <div className="border-b border-[#1C2430] py-6 lg:py-8">
        <div className="mx-auto flex w-[96%] max-w-[1200px] items-center">
          <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
            <div className="cursor-pointer" onClick={() => router.push('/')}>
              <Logo />
            </div>
            <div className="flex gap-2">
              <p className="rounded-full border border-[#212945] bg-[#191F34]  py-[0.35rem] px-4 text-sm font-semibold text-[#9EAEC7]">
                Earnings:{' '}
                <span className="text-[#F6A50B]">${totalEarningsUSD}</span>
              </p>
              <p className="rounded-full border border-[#212945] bg-[#191F34] py-[0.35rem] px-4 text-sm font-semibold text-[#9EAEC7]">
                Projects:{' '}
                <span className="text-[#F6A50B]">{totalNumberOfProjects}</span>
              </p>
            </div>
          </div>
          <div className="hidden gap-8 whitespace-nowrap lg:flex">
            <a href="/projects" className="text-white">
              <p className="text-[1.1rem] font-medium">Projects</p>
            </a>
            <a href="/rainmakers" className="text-white">
              <p className="text-[1.1rem] font-medium">Rainmakers</p>
            </a>
            <a href="/sponsors" className="text-white">
              <p className="text-[1.1rem] font-medium">Sponsors</p>
            </a>
          </div>
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <MotionIconButton
                  size={'md'}
                  _hover={{ bg: 'none' }}
                  icon={<CloseIcon color="white" />}
                  aria-label={'Open Menu'}
                  bg="none"
                  onClick={isOpen ? onClose : onOpen}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={iconVariants}
                />
              ) : (
                <MotionIconButton
                  size={'md'}
                  _hover={{ bg: 'none' }}
                  icon={<HamburgerIcon color="white" h="24px" w="24px" />}
                  aria-label={'Open Menu'}
                  bg="none"
                  onClick={isOpen ? onClose : onOpen}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={iconVariants}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <Collapse in={isOpen}>
          <MotionBox
            pb={3}
            pt={5}
            w="96%"
            mx="auto"
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            variants={navLinksVariants}
          >
            <Stack as={'nav'} spacing={3}>
              <a href="/projects" className="text-white">
                <p className="text-[1.1rem] font-medium">Projects</p>
              </a>
              <a href="/rainmakers" className="text-white">
                <p className="text-[1.1rem] font-medium">Rainmakers</p>
              </a>
              <a href="/sponsors" className="text-white">
                <p className="text-[1.1rem] font-medium">Sponsors</p>
              </a>
            </Stack>
          </MotionBox>
        </Collapse>
      </div>
    </>
  );
}
