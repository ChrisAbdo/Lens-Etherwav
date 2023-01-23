import React from 'react';
import {
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import { CHAIN_ID } from '../const/blockchain';
import useLogin from '../lib/auth/useLogin';
import { MediaRenderer } from '@thirdweb-dev/react';
import { useLensUserContext } from '../context/LensUserContext';
import Link from 'next/link';
import SignInButton from './SignInButton';

const Navbar = () => {
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

  // // If no wallet is connected,
  // if (!address) {
  //   return <ConnectWallet />;
  // }

  // // If is on wrong network,
  // if (isOnWrongNetwork) {
  //   return (
  //     <button className="btn" onClick={() => switchNetwork?.(CHAIN_ID)}>
  //       Switch Network
  //     </button>
  //   );
  // }

  // if (!isSignedIn) {
  //   return (
  //     <button className="btn" onClick={handleLogin}>
  //       Sign In 🌿
  //     </button>
  //   );
  // }

  // if (loadingLensUser) {
  //   return <h1>Loading...</h1>;
  // }

  // if (error) {
  //   return <h1>Error!</h1>;
  // }

  // if (lensUser?.defaultProfile === null) {
  //   return <h1>No Lens Profile</h1>;
  // }

  return (
    <div className="navbar bg-black border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown ">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu w-32 dropdown-content shadow bg-[#292929] rounded-box z-50 font-semibold"
          >
            <li className="flex justify-between">
              <a href="/" className="justify-between">
                Home{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
                  />
                </svg>
              </a>
            </li>
            <li className="flex justify-between">
              <a href="/radio" className="justify-between">
                Radio{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0012 6.75zm-1.683 6.443l-.005.005-.006-.005.006-.005.005.005zm-.005 2.127l-.005-.006.005-.005.005.005-.005.005zm-2.116-.006l-.005.006-.006-.006.005-.005.006.005zm-.005-2.116l-.006-.005.006-.005.005.005-.005.005zM9.255 10.5v.008h-.008V10.5h.008zm3.249 1.88l-.007.004-.003-.007.006-.003.004.006zm-1.38 5.126l-.003-.006.006-.004.004.007-.006.003zm.007-6.501l-.003.006-.007-.003.004-.007.006.004zm1.37 5.129l-.007-.004.004-.006.006.003-.004.007zm.504-1.877h-.008v-.007h.008v.007zM9.255 18v.008h-.008V18h.008zm-3.246-1.87l-.007.004L6 16.127l.006-.003.004.006zm1.366-5.119l-.004-.006.006-.004.004.007-.006.003zM7.38 17.5l-.003.006-.007-.003.004-.007.006.004zm-1.376-5.116L6 12.38l.003-.007.007.004-.004.007zm-.5 1.873h-.008v-.007h.008v.007zM17.25 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 4.5a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  />
                </svg>
              </a>
            </li>
            <li className="flex justify-between">
              <a href="/upload" className="justify-between">
                Upload{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </a>
            </li>
            <li className="flex justify-between">
              <a href="/profile" className="justify-between">
                Profile{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
        <a
          href="/"
          className="bg-gradient-to-r from-yellow-600 to-red-600
                      bg-clip-text text-transparent
                      background-animate text-xl"
        >
          Etherwav
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/radio">Radio</a>
          </li>
          <li>
            <a href="/upload">Upload</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <SignInButton />
      </div>
    </div>
  );
};

export default Navbar;
