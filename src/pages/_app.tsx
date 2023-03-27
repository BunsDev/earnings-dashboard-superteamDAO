import '@/styles/globals.css';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <div className={`${inter.variable} min-h-screen bg-[#0E1218] font-sans`}>
        <Component {...pageProps} />
      </div>
    </ChakraProvider>
  );
}
