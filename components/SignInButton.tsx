import {
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import React from 'react';
import { CHAIN_ID } from '../const/blockchain';
import useLogin from '../lib/auth/useLogin';
import { MediaRenderer } from '@thirdweb-dev/react';
import { useLensUserContext } from '../context/LensUserContext';
import Link from 'next/link';

export default function SignInButton() {
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const {
    data: lensUser,
    isSignedIn,
    isLoading: loadingLensUser,
    error,
  } = useLensUserContext();
  const { mutateAsync: login } = useLogin();

  async function handleLogin() {
    await login();
  }

  // If no wallet is connected,
  if (!address) {
    return <ConnectWallet />;
  }

  // If is on wrong network,
  if (isOnWrongNetwork) {
    return (
      <button className="btn" onClick={() => switchNetwork?.(CHAIN_ID)}>
        Switch Network
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <button className="btn" onClick={handleLogin}>
        Sign In 🌿
      </button>
    );
  }

  if (loadingLensUser) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error!</h1>;
  }

  if (lensUser?.defaultProfile === null) {
    return <h1>No Lens Profile</h1>;
  }

  return (
    <div>
      {/* TODO: Should create profile page and link to it. */}
      <Link href={`/profile/${lensUser?.defaultProfile?.handle}`}>
        <MediaRenderer
          // @ts-ignore: Type does exist.
          src={lensUser?.defaultProfile?.picture?.original?.url || ''}
          alt={lensUser?.defaultProfile?.name || 'Loading...'}
          className="h-12 w-12"
        />
      </Link>
    </div>
  );
}
