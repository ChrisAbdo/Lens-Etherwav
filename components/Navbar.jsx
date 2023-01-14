import React from 'react';
import {
  useNetworkMismatch,
  useAddress,
  ConnectWallet,
  useNetwork,
} from '@thirdweb-dev/react';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
const activeChainId = ChainId.Mumbai;

const Navbar = () => {
  const address = useAddress();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

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
            className="menu menu-compact dropdown-content shadow bg-[#292929] rounded-box w-32"
          >
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/radio">Radio</a>
            </li>
            <li>
              <a href="/upload">Upload</a>
            </li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost normal-case text-xl">
          Radio3
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
        </ul>
      </div>
      <div className="navbar-end">
        {isOnWrongNetwork ? (
          <button
            className="btn btn-outline normal-case"
            onClick={() => switchNetwork?.(activeChainId)}
          >
            Wrong Network!{' '}
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
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </button>
        ) : (
          <ConnectWallet />
        )}
      </div>
    </div>
  );
};

export default Navbar;
