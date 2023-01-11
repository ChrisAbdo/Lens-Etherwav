import '../styles/globals.css';

import Navbar from '../components/Navbar';

import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { Poppins } from '@next/font/google';

const activeChainId = ChainId.Mumbai;

const poppins = Poppins({
  weight: '400',
});

function MyApp({ Component, pageProps }) {
  return (
    <main className={poppins.className}>
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
        <Analytics />
      </ThirdwebProvider>
    </main>
  );
}

export default MyApp;
