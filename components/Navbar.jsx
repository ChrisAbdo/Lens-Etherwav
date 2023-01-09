import React from 'react';
import { ConnectWallet } from '@thirdweb-dev/react';

const Navbar = () => {
  return (
    <div className="navbar bg-black border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
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
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-[#292929] rounded-box w-52"
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
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
