import '@/styles/globals.css';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import useProjects from '@/utils/useProjects';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  useProjects();
  return (
    <ChakraProvider>
      <div className={`${inter.variable} min-h-screen bg-[#14192A] font-sans`}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  );
}
