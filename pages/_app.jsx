import '../styles/globals.css';
import { Poppins } from '@next/font/google';

import Navbar from '../components/Navbar';

import { Toaster } from 'react-hot-toast';

import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

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
      </ThirdwebProvider>
    </main>
  );
}

export default MyApp;
