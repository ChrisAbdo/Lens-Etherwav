import '../styles/globals.css';

import Navbar from '../components/Navbar';

import { Toaster } from 'react-hot-toast';

import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThirdwebProvider desiredChainId={activeChainId}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;
