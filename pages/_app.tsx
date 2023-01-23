import '../styles/globals.css';
import type { AppProps } from 'next/app';

import Navbar from '../components/Navbar';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { Poppins } from '@next/font/google';

import createEmotionCache from '../lib/mui/createEmotionCache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react';
import LensUserContextProvider from '../context/LensUserContext';
import { useRouter } from 'next/router';
import GlobalInformationModalContextProvider, {
  ModalState,
} from '../context/GlobalInformationModalContext';
import { useState } from 'react';

const poppins = Poppins({
  weight: '400',
});

// thirwdeb setup
const desiredChainId = ChainId.Polygon;

// react query setup
const queryClient = new QueryClient();

// Material UI setup
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState | null>(null);

  return (
    <main className={poppins.className}>
      <ThirdwebProvider desiredChainId={desiredChainId}>
        <QueryClientProvider client={queryClient}>
          <LensUserContextProvider>
            <Navbar />

            <Component {...pageProps} />
            <Toaster />
            <Analytics />
          </LensUserContextProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </main>
  );
}
